const mongoose = require("mongoose");


const recentlyViewedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
            viewedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model("RecentlyViewed", recentlyViewedSchema);