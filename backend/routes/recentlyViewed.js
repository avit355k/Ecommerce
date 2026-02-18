const express = require("express");
const router = express.Router();

const RecentlyViewed = require("../models/RecentlyViewed");
const Product = require("../models/product");
const Variant = require("../models/ProductVariant");
const {authenticateToken} = require("../Auth/authUser");

router.post("/add", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const {productId, variantId} = req.body;

        let recentlyViewed = await RecentlyViewed.findOne({user: userId});

        if (!recentlyViewed) {
            recentlyViewed = new RecentlyViewed({
                user: userId,
                items: []
            });
        }

        //  Remove old entry if exists (so we can push fresh one on top)
        recentlyViewed.items = recentlyViewed.items.filter(
            item =>
                item.product.toString() !== productId ||
                item.variant.toString() !== variantId
        );

        //  Add new item at beginning
        recentlyViewed.items.unshift({
            product: productId,
            variant: variantId,
            viewedAt: new Date()
        });

        //  Keep only latest 10
        if (recentlyViewed.items.length > 10) {
            recentlyViewed.items.pop(); // remove last one
        }

        await recentlyViewed.save();

        res.status(200).json({
            success: true,
            message: "Recently viewed updated"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

//get Recently Viewed Products
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const recentlyViewed = await RecentlyViewed.findOne({user: userId})
            .populate({
                path: "items.product",
                model: "Product"
            })
            .populate({
                path: "items.variant",
                model: "ProductVariant"
            });

        if (!recentlyViewed || recentlyViewed.items.length === 0) {
            return res.status(200).json({
                success: true,
                totalProducts: 0,
                data: []
            });
        }

        // Merge product + variant data
        const products = recentlyViewed.items.map(item => {
            const product = item.product;
            const variant = item.variant;

            if (!product || !variant) return null;

            const discountPercent = variant.discountedPrice
                ? Math.round(
                    ((variant.price - variant.discountedPrice) / variant.price) * 100
                )
                : 0;

            return {
                ...product.toObject(),
                price: variant.price,
                discountedPrice: variant.discountedPrice || null,
                countInStock: variant.countInStock,
                discountPercent
            };
        }).filter(Boolean); // remove null

        res.status(200).json({
            success: true,
            totalProducts: products.length,
            data: products
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

module.exports = router;
