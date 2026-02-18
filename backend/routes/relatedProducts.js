const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Category = require("../models/category");
const ProductVariant = require('../models/ProductVariant');

// get Related Products
router.get("/:productId", async (req, res) => {
    try {
        const {productId} = req.params;
        const {limit = 6} = req.query;

        //  Get current product to know its category
        const currentProduct = await Product.findById(productId);

        if (!currentProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        //Find related products (same category, exclude current product)
        const products = await Product.aggregate([
            {
                $match: {
                    _id: {$ne: currentProduct._id},
                    category: currentProduct.category
                }
            },

            {$sort: {createdAt: -1}},
            {$limit: Number(limit)},

            {
                $lookup: {
                    from: "productvariants",
                    let: {productId: "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ["$product", "$$productId"]},
                                        {$eq: ["$isActive", true]},
                                        {$gt: ["$countInStock", 0]}
                                    ]
                                }
                            }
                        },
                        {$sort: {price: 1}},
                        {$limit: 1}
                    ],
                    as: "variant"
                }
            },

            {$unwind: {path: "$variant", preserveNullAndEmptyArrays: true}},

            {
                $addFields: {
                    price: {$ifNull: ["$variant.price", null]},
                    discountedPrice: {$ifNull: ["$variant.discountedPrice", null]},
                    countInStock: {$ifNull: ["$variant.countInStock", 0]},

                    discountPercent: {
                        $cond: [
                            {
                                $and: [
                                    "$variant.discountedPrice",
                                    {$gt: ["$variant.price", 0]}
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

            {$project: {variant: 0}}
        ]);

        res.status(200).json({
            success: true,
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

module.exports = router;