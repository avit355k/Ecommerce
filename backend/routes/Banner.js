const express = require("express");
const router = express.Router();

const Banner = require("../models/Banner");
const Category = require("../models/category");
const {uploadSingle} = require("../middlewares/multer");
const {uploadBanner, deleteImage} = require("../utils/cloudinary");


//upload banner
router.post("/upload", uploadSingle, async (req, res) => {
    try {
        const {title, category, position, redirectType, redirectValue} = req.body;

        if (!category || !position) {
            return res.status(400).json({
                success: false,
                message: "Category and position are required"
            });
        }

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({success: false, message: "Invalid category"});
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Banner image is required"
            });
        }
        const image = await uploadBanner(req.file, "banners");

        let redirect;
        if (redirectType && redirectValue) {
            redirect = {
                type: redirectType,
                value: redirectValue
            };
        }

        const banner = new Banner({
            title,
            category,
            image,
            position,
            redirect,
        });

        const savedBanner = await banner.save();
        res.status(201).json({
            success: true,
            message: "Successfully uploaded",
            savedBanner
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
})

//get all banners
router.get("/", async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const skip = (pageNumber - 1) * limitNumber;

        // Total count
        const total = await Banner.countDocuments();

        // Paginated result
        const bannerList = await Banner.find()
            .populate("category", "name slug")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            total,
            totalPages: Math.ceil(total / limitNumber),
            currentPage: pageNumber,
            bannerList
        });

    } catch (error) {
        console.error("Get Banner Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//Get Banners By category Slug
router.get("/listing", async (req, res) => {
    try {
        const banners = await Banner.find({position: "listingPage"})
            .populate("category", "name slug")
            .sort({createdAt: -1});

        res.status(200).json({
            success: true,
            total: banners.length,
            banners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//get banner by id
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        // Find banner
        const banner = await Banner.findById(id)
            .populate("category", "name slug");

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        res.status(200).json({
            success: true,
            banner
        });

    } catch (error) {
        console.error("Get Banner By ID Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get Banners By Position
router.get("/position/:position", async (req, res) => {
    try {
        const {position} = req.params;

        const allowedPositions = ['homepage', 'offer', 'listingPage', 'promotion'];

        // Validate position
        if (!allowedPositions.includes(position)) {
            return res.status(400).json({
                success: false,
                message: "Invalid position value"
            });
        }

        // Fetch banners
        const banners = await Banner.find({position})
            .populate("category", "name slug")
            .sort({createdAt: -1});

        res.status(200).json({
            success: true,
            total: banners.length,
            banners
        });

    } catch (error) {
        console.error("Get Banner By Position Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//update banner
router.put("/:id", uploadSingle, async (req, res) => {
    try {
        const {title, category, position, redirectType, redirectValue} = req.body;
        const {id} = req.params;

        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        // Validate category if changed
        if (category) {
            const cat = await Category.findById(category);
            if (!cat) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid category"
                });
            }
            banner.category = category;
        }

        // Update image if new file provided
        if (req.file) {
            // Delete old image
            if (banner.image?.public_id) {
                await deleteImage(banner.image.public_id);
            }

            const uploadedImage = await uploadBanner(req.file.path, "banners");

            banner.image = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            };
        }

        // Update normal fields
        if (title) banner.title = title;
        if (position) banner.position = position;

        // Update redirect properly
        if (redirectType && redirectValue) {
            banner.redirect = {
                type: redirectType,
                value: redirectValue
            };
        }

        const updatedBanner = await banner.save();

        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            updatedBanner
        });

    } catch (error) {
        console.error("Update Banner Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//delete banner
router.delete("/:id", async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }
        ;

        if (banner.image?.public_id) {
            await deleteImage(banner.image.public_id);
        }

        await banner.deleteOne();
        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        })
    } catch (error) {
        console.error("Delete Banner Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

module.exports = router;