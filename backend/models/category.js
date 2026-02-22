const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null //Used for Creating Sub-category
        },
        level: {
            type: Number,
            enum: [0, 1, 2, 3],
            default: 0  // 0 = Main Category
        },
        image: {
            type: {
                url: String,
                public_id: String,
            },
            default: null
        },
        color: {
            type: String,
            default: null, //Used Color-code for Sub-Category frontend sections
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {timestamps: true}
);

module.exports =
    mongoose.models.Category ||
    mongoose.model("Category", categorySchema);