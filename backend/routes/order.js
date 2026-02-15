const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const Cart = require("../models/cart");
const Order = require("../models/Order");
const Variant = require("../models/ProductVariant");
const Address = require("../models/Address");
const {authenticateToken} = require("../Auth/authUser");
const razorpay = require("../utils/razorpay");
const PDFDocument = require("pdfkit");


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
            shippingAddressId
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
            orderStatus: "processing",
            statusHistory: [
                {
                    status: "processing"
                }
            ]
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
            .populate("items.variant")
            .populate("shippingAddress")
            .sort({createdAt: -1})
        ;

        res.json({success: true, orders});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//getting all orders for admin
router.get("/all-orders", async (req, res) => {
    try {
        const {status, startDate, endDate, page = 1, limit = 10} = req.query;

        const query = {};
        //filter by status
        if (status) {
            query.orderStatus = status;
        }
        //filter by date range
        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const orders = await Order.find(query)
            .populate("items.product", "name images")
            .populate("items.variant", "price sku")
            .sort({createdAt: -1})
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(query);

        res.json({
            success: true,
            totalOrders,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalOrders / limit),
            orders
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get user order details by id
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.product")
            .populate("items.variant")
            .populate("shippingAddress");

        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        res.json({success: true, order});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Update Order Status (Admin)
router.put("/update-status/:id", async (req, res) => {
    try {
        const {status} = req.body;

        const allowedStatus = [
            "processing",
            "confirmed",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "refund"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status value"});
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        order.orderStatus = status;

        // push into status history
        order.statusHistory.push({
            status: status,
            date: new Date()
        });

        await order.save();

        res.json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Invoice Route
router.get("/:id/invoice", authenticateToken, async (req, res) => {
    try {

        const order = await Order.findById(req.params.id)
            .populate("user")
            .populate("items.product")
            .populate("items.variant")
            .populate("shippingAddress");

        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        // Proper Authorization Check (FIXED 403 ERROR)
        if (order.user._id.toString() !== req.user.id) {
            return res.status(403).json({message: "Unauthorized"});
        }

        // Create PDF
        const doc = new PDFDocument({margin: 50});

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${order._id}.pdf`
        );

        doc.pipe(res);

        // =====================================
        // HEADER
        // =====================================
        doc.fontSize(22).text("INVOICE", {align: "center"});
        doc.moveDown(2);

        // =====================================
        // ORDER INFORMATION
        // =====================================
        doc.fontSize(12);
        doc.text(`Order ID: ${order._id}`);
        doc.text(`Order Date: ${new Date(order.createdAt).toDateString()}`);
        doc.text(`Invoice Date: ${new Date().toDateString()}`);
        doc.moveDown(2);

        // =====================================
        // BILLING ADDRESS
        // =====================================
        doc.fontSize(14).text("Billing Address");
        doc.moveDown(0.5);

        doc.fontSize(12);
        doc.text(order.shippingAddress.fullName);
        doc.text(order.shippingAddress.addressLine);
        doc.text(
            `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
        );
        doc.text(`Phone: ${order.shippingAddress.phone}`);
        doc.moveDown(2);

        // =====================================
        // SHIPPING ADDRESS
        // =====================================
        doc.fontSize(14).text("Shipping Address");
        doc.moveDown(0.5);

        doc.fontSize(12);
        doc.text(order.shippingAddress.fullName);
        doc.text(order.shippingAddress.addressLine);
        doc.text(
            `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
        );
        doc.text(`Phone: ${order.shippingAddress.phone}`);
        doc.moveDown(2);

        // =====================================
        // ITEMS SECTION
        // =====================================
        doc.fontSize(16).text("Order Items");
        doc.moveDown();

        let subtotal = 0;

        order.items.forEach((item, index) => {

            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            doc.fontSize(12).text(
                `${index + 1}. ${item.product.name}`
            );

            doc.text(
                `Variant: ${item.variant?.name || "Default"}`
            );

            doc.text(
                `Quantity: ${item.quantity}   |   Price: ₹${item.price}   |   Subtotal: ₹${itemTotal}`
            );

            doc.moveDown();
        });

        doc.moveDown(2);

        // =====================================
        // PRICING SUMMARY
        // =====================================
        doc.fontSize(16).text("Pricing Details", {align: "right"});
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Subtotal: ₹${subtotal}`, {align: "right"});
        doc.text(`Total Amount: ₹${order.totalAmount}`, {align: "right"});

        doc.moveDown(3);

        doc.text("Thank you for shopping with us!", {
            align: "center"
        });

        doc.end();

    } catch (error) {
        console.error("Invoice error:", error);
        res.status(500).json({message: error.message});
    }
});


module.exports = router;