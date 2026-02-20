const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        dateCreated: {
            type: Date,
            default: Date.now,
        },
    }
);
ReviewSchema.index({product: 1, user: 1}, {unique: true});

module.exports = mongoose.model('Review', ReviewSchema);