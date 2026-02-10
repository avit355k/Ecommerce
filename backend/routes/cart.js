const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");
const User = require("../models/user");
const {authenticateToken} = require("../Auth/authUser");
const Product = require("../models/product");
const Variant = require("../models/ProductVariant");

//add to cart
router.post("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const {productId, variantId, quantity} = req.body;
        const userId = req.user.id; // from JWT

        if (!productId || !variantId || !quantity) {
            return res.status(400).json({message: "All fields are required"});
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({message: "User not found"});
        }

        const variant = await Variant.findById(variantId);
        if (!variant || !variant.isActive) {
            return res.status(404).json({message: "Variant not available"});
        }

        if (variant.countInStock < quantity) {
            return res.status(400).json({message: "Insufficient stock"});
        }

        const price = variant.discountedPrice || variant.price;

        let cart = await Cart.findOne({user: userId});

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    variant: variantId,
                    quantity,
                    price
                }],
                totalPrice: quantity * price
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.variant.toString() === variantId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    product: productId,
                    variant: variantId,
                    quantity,
                    price
                });
            }

            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            );
        }

        await cart.save();
        res.json({success: true, cart});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
});
//Get User Cart
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({user: userId})
            .populate("items.product", "name images slug")
            .populate("items.variant", "price discountedPrice attributes countInStock");

        if (!cart) {
            return res.json({
                success: true,
                subtotal: 0,
                totalPrice: 0,
                discount: 0,
                cart: {items: []}
            });
        }

        const totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const subtotal = cart.items.reduce((sum, item) => {
            const originalPrice = item.variant?.price || item.price;
            return sum + originalPrice * item.quantity;
        }, 0);

        const totalPrice = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );

        const discount = subtotal - totalPrice;

        res.json({
            success: true,
            totalItems,
            subtotal,
            discount,
            totalPrice,
            cart
        });

    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

//update quantity
router.put("/update", authenticateToken, async (req, res) => {
    try {
        const {variantId, quantity} = req.body;
        const userId = req.user.id;

        if (!variantId || quantity < 1) {
            return res.status(400).json({message: "Invalid data"});
        }

        const variant = await Variant.findById(variantId);
        if (!variant || !variant.isActive) {
            return res.status(404).json({message: "Variant not available"});
        }

        if (variant.countInStock < quantity) {
            return res.status(400).json({message: "Insufficient stock"});
        }

        const cart = await Cart.findOne({user: userId});
        if (!cart) {
            return res.status(404).json({message: "Cart not found"});
        }

        const item = cart.items.find(
            item => item.variant.toString() === variantId
        );

        if (!item) {
            return res.status(404).json({message: "Item not found in cart"});
        }

        item.quantity = quantity;

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.quantity * item.price,
            0
        );

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Quantity updated",
            cart
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// remove cart item
router.delete("/remove/:variantId", authenticateToken, async (req, res) => {
  try {
    const { variantId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.variant._id.toString() !== variantId
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//clear cart
router.delete("/clear", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        await Cart.findOneAndDelete({user: userId});

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;