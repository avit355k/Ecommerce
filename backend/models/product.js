const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        description: {
            type: String,
            required: true
        },
        productDetails: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            index: true
        },
        brand: {
            type: String,
            trim: true,
            index: true
        },
        images: [{
            url: {type: String, required: true},
            public_id: {type: String, required: true}
        }],
        isFeatured: {
            type: Boolean,
            default: false
        },
        averageRating: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        },
        dateCreated: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

module.exports =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);
