const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
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
        stars: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        }
    }
);

RatingSchema.index({product: 1, user: 1}, {unique: true});

module.exports = mongoose.model("Rating", RatingSchema);