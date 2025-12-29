const Product = require('../models/product');
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
// Utility: Upload images to Cloudinary
const uploadImages = async (filesOrUrls) => {
    const limit = pLimit(3);
    const uploads = filesOrUrls.map(item =>
        limit(() => cloudinary.uploader.upload(
            item.tempFilePath || item, // handles both file and URL
            { folder: "products" }
        ))
    );
    const results = await Promise.all(uploads);
    return results.map(r => r.secure_url);
};

// Create Product
router.post('/create', async (req, res) => {
    try {
        const { name, brand, description, price, category, countInStock, images } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: "Name, price, and category are required" });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ success: false, message: "Invalid category" });
        }

        let imageUrls = [];

        if (req.files?.images) {
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            imageUrls = await uploadImages(files);
        } else if (images) {
            const urls = Array.isArray(images) ? images : [images];
            imageUrls = await uploadImages(urls);
        }

        const product = new Product({
            name,
            brand,
            description,
            price,
            category,
            countInStock,
            images: imageUrls
        });

        const savedProduct = await product.save();
        res.status(201).json({ success: true, data: savedProduct });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// Get all products
router.get('/', async (req, res) => {
    try {
        const productList = await Product.find().populate("category");

        if (!productList || productList.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).json(productList);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { category, images } = req.body;

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ success: false, message: "Invalid category" });
            }
        }

        let imageUrls = [];

        if (req.files?.images) {
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            imageUrls = await uploadImages(files);
        } else if (images) {
            const urls = Array.isArray(images) ? images : [images];
            imageUrls = await uploadImages(urls);
        }

        const updateData = { ...req.body };

        if (imageUrls.length > 0) {
            // Option A: Replace old images
            updateData.images = imageUrls;
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//delete Products
router.delete('/:id', async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deleteProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
