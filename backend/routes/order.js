const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const Cart = require("../models/cart");
const Order = require("../models/Order");
const Variant = require("../models/ProductVariant");
const Address = require("../models/Address");
const {authenticateToken} = require("../Auth/authUser");
const razorpay = require("../utils/razorpay");


// Create Razorpay Order
router.post("/create-razorpay-order", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const {shippingAddressId} = req.body;

        const address = await Address.findOne({
            _id: shippingAddressId,
            user: userId
        });

        if (!address) {
            return res.status(404).json({message: "Invalid address"});
        }

        const cart = await Cart.findOne({user: userId})
            .populate("items.variant");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({message: "Cart is empty"});
        }

        // Validate stock
        for (let item of cart.items) {
            if (item.variant.countInStock < item.quantity) {
                return res.status(400).json({
                    message: `${item.variant._id} out of stock`
                });
            }
        }

        const options = {
            amount: cart.totalPrice * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            razorpayOrder,
            shippingAddress
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// verify payment and create order
router.post("/verify-payment", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddressId
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({message: "Payment verification failed"});
        }
        const address = await Address.findOne({
            _id: shippingAddressId,
            user: userId
        });

        if (!address) {
            return res.status(404).json({message: "Invalid address"});
        }

        const cart = await Cart.findOne({user: userId})
            .populate("items.product")
            .populate("items.variant");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({message: "Cart empty"});
        }

        // Create Order in DB
        const order = new Order({
            user: userId,
            items: cart.items,
            shippingAddress: shippingAddressId,
            paymentInfo: {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                method: "Razorpay",
                status: "paid"
            },
            totalAmount: cart.totalPrice,
            orderStatus: "processing"
        });

        await order.save();

        // Decrease stock
        for (let item of cart.items) {
            const variant = await Variant.findById(item.variant._id);
            variant.countInStock -= item.quantity;
            await variant.save();
        }

        // Clear cart
        await Cart.findOneAndDelete({user: userId});

        res.status(200).json({
            success: true,
            message: "Payment successful & Order created",
            order
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get user orders
router.get("/my-orders", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({user: req.user.id})
            .populate("items.product", "name images")
            .populate("shippingAddress")
            .sort({createdAt: -1});

        res.json({success: true, orders});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;