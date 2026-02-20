const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Rating = require("../models/Rating");
const Product = require("../models/product");
const {authenticateToken} = require("../Auth/authUser");

// Helper
const updateProductAverageRating = async (productId) => {
    const stats = await Rating.aggregate([
        {$match: {product: new mongoose.Types.ObjectId(productId)}},
        {
            $group: {
                _id: "$product",
                avgRating: {$avg: "$stars"}
            }
        }
    ]);

    const product = await Product.findById(productId);
    if (!product) return;

    product.averageRating = stats.length > 0
        ? Number(stats[0].avgRating.toFixed(1))
        : 0;

    await product.save();
};

// Add / Update Rating
router.post("/add", authenticateToken, async (req, res) => {
    try {
        const {productId, stars} = req.body;

        if (!productId || !stars) {
            return res.status(400).json({message: "ProductId and stars required"});
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        const rating = await Rating.findOneAndUpdate(
            {product: productId, user: req.user.id},
            {stars},
            {new: true, upsert: true}
        );

        await updateProductAverageRating(productId);

        res.json({
            message: "Rating saved successfully",
            rating
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get rating of logged-in user for a product
router.get("/user/:productId", authenticateToken, async (req, res) => {
    try {
        const {productId} = req.params;

        const rating = await Rating.findOne({
            product: productId,
            user: req.user.id
        });

        if (!rating) {
            return res.json({
                stars: 0,
                message: "User has not rated this product"
            });
        }

        res.json({
            stars: rating.stars
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get Rating Summary
router.get("/:productId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)
            .select("averageRating");

        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        res.json(product);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Delete Rating
router.delete("/:productId", authenticateToken, async (req, res) => {
    try {
        await Rating.findOneAndDelete({
            product: req.params.productId,
            user: req.user.id
        });

        await updateProductAverageRating(req.params.productId);

        res.json({message: "Rating deleted"});

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;