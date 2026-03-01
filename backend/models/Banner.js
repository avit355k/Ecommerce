const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    image: {
        url: {type: String, required: true},
        public_id: {type: String, required: true}
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true
    },
    position: {
        type: String,
        required: true,
        enum: ['homepage', 'offer', 'listingPage', 'promotion'],
        default: "homepage"
    },
    redirect: {
        type: {
            type: String,
            enum: ["category", "product", "external"]
        },
        value: String
    }

}, {timestamps: true});

module.exports = mongoose.model('Banner', bannerSchema);