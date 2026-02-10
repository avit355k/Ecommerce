const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
    totalPrice: {
        type: Number,
        default: 0
    },

}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);