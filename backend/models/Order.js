const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductVariant",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,// snapshot price
                required: true,
            }
        }
    ],
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    paymentInfo: {
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        method: String,
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        }
    },
    totalAmount: Number,
    orderStatus: {
        type: String,
        enum: ["processing", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled", "refund"],
        default: "processing"
    },
    statusHistory: [
        {
            status: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);
