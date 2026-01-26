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
        comments: {type: String, required: true, trim: true},
        images: [String],

        dateCreated: {
            type: Date,
            default: Date.now,
        },
    }
);

module.exports = mongoose.model('Review', ReviewSchema);