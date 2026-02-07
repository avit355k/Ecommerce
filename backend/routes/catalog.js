const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Category = require("../models/category");
const ProductVariant = require('../models/ProductVariant');


const { getAllChildCategories } = require("../utils/category");
const { getSortStage } = require("../utils/sort");

// GET PRODUCTS BY CATEGORY SLUG
router.get("/category/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const { sort, minPrice, maxPrice, brands, discount, includeOutOfStock, ...dynamicFilters } = req.query;
        //category validation
        const category = await Category.findOne({ slug, isActive: true });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const allCategories = await Category.find({ isActive: true }).lean();
        const childCategoryIds = getAllChildCategories(allCategories, category._id);
        const categoryIds = [category._id, ...childCategoryIds];

       //base product match (category + optional brand)
        const productMatch = {
            category: { $in: categoryIds }
        };

        if (brands) {
            productMatch.brand = { $in: brands.split(",") };
        }

        // product details filters (optional)
        Object.keys(dynamicFilters).forEach(key => {
            if (key.startsWith("detail_")) {
                const detailKey = key.replace("detail_", "");
                productMatch[`productDetails.${detailKey}`] = {
                    $in: dynamicFilters[key].split(",")
                };
            }
        });

       //varient attribute filters (optional) - these will be applied in the $lookup pipeline to ensure we only join relevant variants, improving performance
        const variantAttrConditions = [];

        Object.keys(dynamicFilters).forEach(key => {
            if (key.startsWith("attr_")) {
                const attrKey = key.replace("attr_", "");
                variantAttrConditions.push({
                    $in: [`$attributes.${attrKey}`, dynamicFilters[key].split(",")]
                });
            }
        });

      //aggregate query to fetch products with their lowest priced active variant, applying all filters and sorting
        const products = await Product.aggregate([
            { $match: productMatch },

            {
                $lookup: {
                    from: "productvariants",
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$product", "$$productId"] },
                                        { $eq: ["$isActive", true] },
                                        { $gt: ["$countInStock", 0] },
                                        ...(variantAttrConditions.length
                                            ? [{ $and: variantAttrConditions }]
                                            : [])
                                    ]
                                }
                            }
                        },
                        { $sort: { price: 1 } },
                        { $limit: 1 }
                    ],
                    as: "variant"
                }
            },

            // unwind the variant array (will be empty if no active variants, but that's fine as we handle that in $addFields)
            { $unwind: "$variant" },

           // calculate price, discount, stock based on the joined variant (if exists)
            {
                $addFields: {
                    price: { $ifNull: ["$variant.price", null] },
                    discountedPrice: { $ifNull: ["$variant.discountedPrice", null] },
                    countInStock: { $ifNull: ["$variant.countInStock", 0] },

                    discountPercent: {
                        $cond: [
                            {
                                $and: [
                                    "$variant.discountedPrice",
                                    { $gt: ["$variant.price", 0] }
                                ]
                            },
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    {
                                                        $subtract: [
                                                            "$variant.price",
                                                            "$variant.discountedPrice"
                                                        ]
                                                    },
                                                    "$variant.price"
                                                ]
                                            },
                                            100
                                        ]
                                    },
                                    0
                                ]
                            },
                            0
                        ]
                    }
                }
            },

           // final match stage to apply price range, discount, stock availability filters
            {
                $match: {
                    ...(minPrice || maxPrice
                        ? {
                            price: {
                                ...(minPrice && { $gte: Number(minPrice) }),
                                ...(maxPrice && { $lte: Number(maxPrice) })
                            }
                        }
                        : {}),

                    ...(discount
                        ? { discountPercent: { $gte: Number(discount) } }
                        : {}),

                    ...(includeOutOfStock === "true"
                        ? {}
                        : { $or: [{ price: null }, { countInStock: { $gt: 0 } }] })
                }
            },

            { $project: { variant: 0 } },
            { $sort: getSortStage(sort) }
        ]);

        res.status(200).json({
            success: true,
            category: {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                level: category.level
            },
            totalProducts: products.length,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//get Products details along with varients by productid
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        //Fetch product
        const product = await Product.findById(productId)
            .populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Fetch variants
        const variants = await ProductVariant.find({
            product: product._id,
            isActive: true,
        });

        //  Aggregate pricing & stock
        let minPrice = null;
        let maxPrice = null;
        let totalStock = 0;

        variants.forEach(v => {
            const price = v.discountedPrice || v.price;

            minPrice = minPrice === null ? price : Math.min(minPrice, price);
            maxPrice = maxPrice === null ? price : Math.max(maxPrice, price);

            totalStock += v.countInStock;
        });

        res.status(200).json({
            success: true,
            data: {
                product,
                variants,
                priceRange: { min: minPrice, max: maxPrice },
                totalStock,

            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});
//Get Filters for a Category
router.get("/filters/:slug", async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.json({ success: true, filters: {} });

    const allCategories = await Category.find({ isActive: true }).lean();
    const childCategoryIds = getAllChildCategories(allCategories, category._id);
    const categoryIds = [category._id, ...childCategoryIds];

    const products = await Product.find({ category: { $in: categoryIds } });
    const variants = await ProductVariant.find({
        product: { $in: products.map(p => p._id) },
        isActive: true
    });

    const filters = {
        brands: new Set(),
        attributes: {},
        details: {}
    };

    products.forEach(p => {
        if (p.brand) filters.brands.add(p.brand);

        Object.entries(p.productDetails || {}).forEach(([k, v]) => {
            if (!filters.details[k]) filters.details[k] = new Set();
            filters.details[k].add(v);
        });
    });

    variants.forEach(v => {
        v.attributes?.forEach((val, key) => {
            if (!filters.attributes[key]) filters.attributes[key] = new Set();
            filters.attributes[key].add(val);
        });
    });

    res.json({
        success: true,
        filters: {
            brands: [...filters.brands],
            attributes: Object.fromEntries(
                Object.entries(filters.attributes).map(([k, v]) => [k, [...v]])
            ),
            details: Object.fromEntries(
                Object.entries(filters.details).map(([k, v]) => [k, [...v]])
            )
        }
    });
});

module.exports = router;