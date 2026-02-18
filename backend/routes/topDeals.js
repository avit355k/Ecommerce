const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Category = require("../models/category");
const ProductVariant = require('../models/ProductVariant');

//GET TOP DEALS (Highest Discount First)
router.get("/", async (req, res) => {
    try {
        const {limit = 10, minDiscount = 1} = req.query;

        const products = await Product.aggregate([
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

            {$unwind: {path: "$variant", preserveNullAndEmptyArrays: false}},

            {
                $addFields: {
                    price: "$variant.price",
                    discountedPrice: "$variant.discountedPrice",
                    countInStock: "$variant.countInStock",

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

            // Only keep products with discount >= minDiscount
            {
                $match: {
                    discountPercent: {$gte: Number(minDiscount)}
                }
            },

            {$sort: {discountPercent: -1}},
            {$limit: Number(limit)},

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