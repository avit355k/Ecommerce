const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
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
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model("Wishlist", WishlistSchema);