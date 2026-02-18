const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Wishlist = require("../models/Wishlist");
const Product = require("../models/product");
const Variant = require("../models/ProductVariant");
const {authenticateToken} = require("../Auth/authUser");

//add to wishlist
router.post("/add", authenticateToken, async (req, res) => {
    try {
        const {productId} = req.body;
        const userId = req.user.id;

        let wishlist = await Wishlist.findOne({user: userId});

        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                items: []
            });
        }

        const existingItem = wishlist.items.find(
            item => item.product.toString() === productId
        );

        // If already exists → REMOVE
        if (existingItem) {
            wishlist.items = wishlist.items.filter(
                item => item.product.toString() !== productId
            );

            await wishlist.save();

            return res.json({
                success: true,
                removed: true
            });
        }

        //If not exists → ADD
        const variant = await Variant.findOne({
            product: productId,
            isActive: true,
        });

        if (!variant) {
            return res.status(400).json({
                message: "Product is not found"
            });
        }

        wishlist.items.push({
            product: productId,
            variant: variant._id
        });

        await wishlist.save();

        res.json({
            success: true,
            added: true
        });

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//get user wishlist
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({user: userId})
            .populate({
                path: "items.product",
                select: "name slug images brand"
            })
            .populate({
                path: "items.variant",
                select: "price discountedPrice sku attributes"
            });

        if (!wishlist) {
            return res.status(200).json({items: []});
        }

        res.status(200).json(wishlist);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//remove from wishlist
router.delete("/remove/:productId", authenticateToken, async (req, res) => {
    try {
        const {productId} = req.params;
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({user: userId});

        if (!wishlist) {
            return res.status(404).json({message: "Wishlist not found"});
        }

        wishlist.items = wishlist.items.filter(item =>
            item.product.toString() !== productId
        );

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Removed from wishlist"
        });

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;