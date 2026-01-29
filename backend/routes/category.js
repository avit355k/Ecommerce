const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const slugify = require("slugify");
const {uploadSingle} = require("../middlewares/multer");
const {uploadSingleImage, deleteImage} = require("../utils/cloudinary");


// Create Category
router.post('/create', uploadSingle, async (req, res) => {
    try {
        // Create new category
        const {name, parent, level, color, isFeatured} = req.body;

        if (!name) {
            return res.status(400).json({success: false, message: "Category name required"});
        }

        let image = null;

        if (req.file) {
            image = await uploadSingleImage(req.file, "categories");
        }

        const category = new Category({
            name,
            slug: slugify(name),
            parent: parent || null,
            level: level || 0,
            image: image,
            color,
            isFeatured
        });

        const savedCategory = await category.save();

        res.status(201).json(savedCategory);
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
        const categoryList = await Category.find({isActive: true});

        if (!categoryList) {
            return res.status(404).json({success: false, message: "No categories found"});
        }

        res.status(200).json({success: true, count: categoryList.length, data: categoryList});
    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
});

// get by Category id
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({success: false, message: "No categories found"});
        }

        return res.status(200).send({success: true, data: category});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

//Get Sub-categories by Parent
router.get("/parent/:parentId", async (req, res) => {
    const categories = await Category.find({
        parent: req.params.parentId,
        isActive: true
    });

    res.json({success: true, data: categories});
});

// Update Category by ID
router.put("/:id", uploadSingle, async (req, res) => {
    try {
        const {name, color, parent, level, isFeatured, isActive} = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({success: false, message: "Category not found"});
        }

        let image = category.image;

        if (req.file) {
            // delete old image
            if (category.image?.public_id) {
                await deleteImage(category.image.public_id);
            }

            image = await uploadSingleImage(req.file, "categories");
        }

        category.name = name ?? category.name;
        category.slug = name ? slugify(name) : category.slug;
        category.color = color ?? category.color;
        category.parent = parent ?? category.parent;
        category.level = level ?? category.level;
        category.isFeatured = isFeatured ?? isFeatured;
        category.isActive = isActive ?? category.isActive;
        category.image = image;

        const updatedCategory = await category.save();

        res.status(200).json({success: true, data: updatedCategory});

    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

// Delete Category by ID
router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({success: false, message: "Category not found"});
        }

        if (category.image?.public_id) {
            await deleteImage(category.image.public_id);
        }

        await category.deleteOne();

        res.status(200).json({success: true, message: "Category deleted successfully"});

    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

module.exports = router;
