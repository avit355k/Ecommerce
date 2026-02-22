const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const ProductVariant = require("../models/ProductVariant");
const Category = require("../models/Category");


// GET /api/products/search
router.get("/results", async (req, res) => {
    try {
        const {
            keyword,
            category,
            brand,
            minPrice,
            maxPrice,
            rating,
            inStock,
            sortBy,
            page = 1,
            limit = 12,
            ...attributes
        } = req.query;

        const productQuery = {};

        // 1️⃣ Keyword search (safe regex instead of $text)
        if (keyword && keyword.trim() !== "") {
            productQuery.$or = [
                {name: {$regex: keyword, $options: "i"}},
                {brand: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}}
            ];
        }

        // 2️⃣ Category filter
        if (category) {
            const categories = category.split(",");
            productQuery.category = {$in: categories};
        }

        // 3️⃣ Brand filter
        if (brand) {
            const brands = brand.split(",");
            productQuery.brand = {$in: brands};
        }

        // 4️⃣ Rating filter
        if (rating) {
            const ratings = rating.split(",").map(Number);
            productQuery.averageRating = {$gte: Math.min(...ratings)};
        }

        // Fetch products first
        const products = await Product.find(productQuery).lean();

        if (!products.length) {
            return res.json({
                totalProducts: 0,
                page: Number(page),
                pages: 0,
                data: []
            });
        }

        const productIds = products.map(p => p._id);

        // 5️⃣ Variant Query
        const variantQuery = {
            product: {$in: productIds},
            isActive: true
        };

        // 6️⃣ Price filter
        if (minPrice || maxPrice) {
            variantQuery.price = {};
            if (minPrice) variantQuery.price.$gte = Number(minPrice);
            if (maxPrice) variantQuery.price.$lte = Number(maxPrice);
        }

        // 7️⃣ Stock filter
        if (inStock === "true") {
            variantQuery.countInStock = {$gt: 0};
        }

        // 8️⃣ Dynamic attributes
        Object.keys(attributes).forEach(key => {
            const values = attributes[key].split(",");
            variantQuery[`attributes.${key}`] = {$in: values};
        });
        const variants = await ProductVariant.find(variantQuery).lean();

        if (!variants.length) {
            return res.json({
                totalProducts: 0,
                page: Number(page),
                pages: 0,
                data: []
            });
        }

        // Merge product + cheapest variant
        const productMap = new Map();

        variants.forEach(variant => {

            const product = products.find(
                p => p._id.toString() === variant.product.toString()
            );

            if (!product) return;

            const price = variant.price;
            const discountedPrice = variant.discountedPrice || 0;

            let discountPercent = 0;
            if (discountedPrice && discountedPrice < price) {
                discountPercent = Math.round(
                    ((price - discountedPrice) / price) * 100
                );
            }

            if (!productMap.has(product._id.toString())) {
                productMap.set(product._id.toString(), {
                    ...product,
                    price,
                    discountedPrice,
                    countInStock: variant.countInStock,
                    discountPercent
                });
            }
        });

        let finalProducts = Array.from(productMap.values());

        // 9️⃣ Sorting
        if (sortBy === "price_low_high") {
            finalProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_high_low") {
            finalProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            finalProducts.sort((a, b) => b.averageRating - a.averageRating);
        } else {
            finalProducts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        // 🔟 Pagination
        const startIndex = (Number(page) - 1) * Number(limit);
        const paginated = finalProducts.slice(
            startIndex,
            startIndex + Number(limit)
        );

        res.json({
            totalProducts: finalProducts.length,
            page: Number(page),
            pages: Math.ceil(finalProducts.length / Number(limit)),
            data: paginated
        });

    } catch (error) {
        res.status(500).json({
            message: "Search failed",
            error: error.message
        });
    }
});

// GET /api/products/suggestions
router.get("/suggestions", async (req, res) => {
    try {
        const {keyword} = req.query;

        if (!keyword || keyword.trim().length < 2) {
            return res.json({success: true, suggestions: []});
        }

        const products = await Product.find({
            $or: [
                {name: {$regex: keyword, $options: "i"}},
                {brand: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}}
            ]
        })
            .select("name slug description brand images category")
            .populate("category", "name slug")
            .limit(6)
            .lean();

        res.json({
            success: true,
            suggestions: products
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Suggestion failed", error: error.message});
    }
});

// get Filters
router.get("/filters", async (req, res) => {
    try {
        const {keyword} = req.query;

        const productQuery = {};

        if (keyword && keyword.trim() !== "") {
            productQuery.$or = [
                {name: {$regex: keyword, $options: "i"}},
                {brand: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}}
            ];
        }

        const products = await Product.find(productQuery).lean();

        if (!products.length) {
            return res.json({
                success: true,
                categories: [],
                brands: [],
                priceRange: {min: 0, max: 0},
                ratings: [5, 4, 3, 2, 1],
                attributes: {},
                inStockAvailable: false
            });
        }

        const productIds = products.map(p => p._id);

        const variants = await ProductVariant.find({
            product: {$in: productIds},
            isActive: true
        }).lean();

        const brands = [
            ...new Set(products.map(p => p.brand).filter(Boolean))
        ];

        const categories = await Category.find({
            _id: {$in: products.map(p => p.category)}
        }).select("_id name slug").lean();

        const prices = variants.map(v => v.price);

        const attributesMap = {};

        variants.forEach(v => {
            if (!v.attributes) return;

            Object.entries(v.attributes).forEach(([key, value]) => {
                if (!attributesMap[key]) {
                    attributesMap[key] = new Set();
                }
                attributesMap[key].add(value);
            });
        });

        const formattedAttributes = {};
        Object.keys(attributesMap).forEach(key => {
            formattedAttributes[key] = Array.from(attributesMap[key]);
        });

        res.json({
            success: true,
            categories,
            brands,
            priceRange: {
                min: prices.length ? Math.min(...prices) : 0,
                max: prices.length ? Math.max(...prices) : 0
            },
            ratings: [5, 4, 3, 2, 1],
            attributes: formattedAttributes,
            inStockAvailable: variants.some(v => v.countInStock > 0)
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch filters",
            error: error.message
        });
    }
});

module.exports = router;