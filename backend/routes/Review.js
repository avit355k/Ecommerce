const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Review = require("../models/Review");
const Rating = require("../models/Rating");
const Product = require("../models/product");
const {authenticateToken} = require("../Auth/authUser");

// Helper: Update Review Count
const updateReviewCount = async (productId) => {
    const count = await Review.countDocuments({product: productId});

    await Product.findByIdAndUpdate(productId, {
        numReviews: count
    });
};

//Add Review - One review per user per product
router.post("/add", authenticateToken, async (req, res) => {
    try {
        const {productId, title, description} = req.body;

        if (!productId || !description) {
            return res.status(400).json({
                message: "ProductId and description are required"
            });
        }

        // Check product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        // Prevent duplicate review
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product"
            });
        }

        const review = await Review.create({
            product: productId,
            user: req.user.id,
            title,
            description
        });

        await updateReviewCount(productId);

        res.status(201).json({
            message: "Review added successfully",
            review
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get All Reviews of a Product
router.get("/full/:productId", async (req, res) => {
    try {
        const {productId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({message: "Invalid product id"});
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const reviews = await Review.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId)
                }
            },

            // Join User
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {$unwind: "$user"},

            // Join Rating (same product + same user)
            {
                $lookup: {
                    from: "ratings",
                    let: {userId: "$user._id", productId: "$product"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ["$user", "$$userId"]},
                                        {$eq: ["$product", "$$productId"]}
                                    ]
                                }
                            }
                        }
                    ],
                    as: "ratingData"
                }
            },

            {
                $unwind: {
                    path: "$ratingData",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    dateCreated: 1,
                    "user._id": 1,
                    "user.name": 1,
                    stars: {
                        $ifNull: ["$ratingData.stars", 0]
                    }
                }
            },

            {$sort: {dateCreated: -1}},
            {$skip: skip},
            {$limit: limit}
        ]);

        const totalReviews = await Review.countDocuments({product: productId});

        res.json({
            totalReviews,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
            reviews
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
// Get Logged-in User’s Review for a Product
router.get("/user/:productId", authenticateToken, async (req, res) => {
    try {
        const review = await Review.findOne({
            product: req.params.productId,
            user: req.user.id
        });

        res.json(review || null);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//update Review of a Product
router.put("/update/:productId", authenticateToken, async (req, res) => {
    try {
        const {productId} = req.params;
        const {title, description} = req.body;

        if (!description) {
            return res.status(400).json({
                message: "Description is required"
            });
        }

        const review = await Review.findOneAndUpdate(
            {
                product: productId,
                user: req.user.id
            },
            {
                title,
                description
            },
            {
                new: true
            }
        );

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.json({
            message: "Review updated successfully",
            review
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//   Delete Review (Only Owner Can Delete)
router.delete("/:reviewId", authenticateToken, async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.reviewId,
            user: req.user.id
        });

        if (!review) {
            return res.status(404).json({
                message: "Review not found or unauthorized"
            });
        }

        await updateReviewCount(review.product);

        res.json({
            message: "Review deleted successfully"
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;