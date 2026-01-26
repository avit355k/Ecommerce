const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    attributes: {
        type: Map,
        of: String
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: Number,
    countInStock: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    }
}, {timestamps: true});

ProductVariantSchema.index(
    {product: 1, attributes: 1},
    {unique: true}
);

module.exports =
    mongoose.models.ProductVariant ||
    mongoose.model("ProductVariant", ProductVariantSchema);
