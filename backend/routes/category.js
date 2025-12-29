const Category = require('../models/category');
const express = require('express');
const router = express.Router();
const pLimit = require("p-limit");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Category
router.post('/create', async (req, res) => {
    try {
        const limit = pLimit(2);

        // Upload images to Cloudinary with concurrency limit
        const imagestoUpload = req.body.images.map((image) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(image);
                return result;
            });
        });

        const uploadStatus = await Promise.all(imagestoUpload);

        if (!uploadStatus || uploadStatus.length === 0) {
            return res.status(500).json({
                error: "Images couldn't be uploaded",
                status: false
            });
        }

        // Extract image URLs
        const imgurl = uploadStatus.map((item) => item.secure_url);

        // Create new category
        let category = new Category({
            name: req.body.name,
            images: imgurl,
            color: req.body.color
        });

        category = await category.save();

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({
            error: err.message,
            status: false
        });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (!categoryList) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }

        res.status(200).json(categoryList);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// get by Category id
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }

        return res.status(200).send(category);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update Category by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, images, color } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        images,
        color
      },
      { new: true } // return updated doc
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Category by ID
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id); 

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
