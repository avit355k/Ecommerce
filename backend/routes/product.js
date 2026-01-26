const express = require("express");
const router = express.Router();
const slugify = require("slugify");

const Product = require("../models/product");
const Category = require("../models/category");


const {uploadMultiple} = require("../middlewares/multer");
const {uploadMultipleImages, deleteImage} = require("../utils/cloudinary");


//create new products
router.post("/create", uploadMultiple, async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            brand,
            isFeatured
        } = req.body;

        if (!name || !category) {
            return res.status(400).json({success: false, message: "Required fields missing"});
        }

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(400).json({success: false, message: "Invalid category"});
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({success: false, message: "At least one image required"});
        }

        const images = await uploadMultipleImages(req.files, "products");

        const product = new Product({
            name,
            slug: slugify(name),
            description,
            category,
            brand,
            images,
            isFeatured
        });

        const saved = await product.save();
        res.status(201).json({success: true, data: saved});

    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
});

//get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name slug");

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

//get products by id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category", "name slug");

        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        res.status(200).json({success: true, data: product});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

//update products
router.put("/:id", uploadMultiple, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        if (req.body.name) {
            product.name = req.body.name;
            product.slug = slugify(req.body.name);
        }

        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(400).json({success: false, message: "Invalid category"});
            }
            product.category = req.body.category;
        }

        product.description = req.body.description ?? product.description;
        product.brand = req.body.brand ?? product.brand;
        product.isFeatured = req.body.isFeatured ?? product.isFeatured;

        // Replace images
        if (req.files && req.files.length > 0) {
            // delete old images
            for (const img of product.images) {
                await deleteImage(img.public_id);
            }

            product.images = await uploadMultipleImages(req.files, "products");
        }

        const updated = await product.save();

        res.status(200).json({success: true, data: updated});

    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

//delete products
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        // delete all images
        for (const img of product.images) {
            await deleteImage(img.public_id);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

module.exports = router;
