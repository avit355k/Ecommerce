const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');

//Add Product Varient
router.post("/add", async (req, res) => {
    try {
        const {product, attributes, price, discountedPrice, countInStock, isActive, sku} = req.body;

        if (!product || !price || countInStock === undefined) {
            return res.status(400).json({success: false, message: "Required fields missing"});
        }

        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(400).json({success: false, message: "Product not found"});
        }

        const variant = new ProductVariant({
            product,
            attributes,
            price,
            discountedPrice,
            countInStock,
            isActive,
            sku
        });

        const saved = await variant.save();
        res.status(201).json({success: true, data: saved});

    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
});

//Edit Product Varient
router.put("/update/:id", async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.id);
        if (!variant) {
            return res.status(404).json({success: false, message: "Variant not found"});
        }

        if (req.body.product) {
            const productExists = await Product.findById(req.body.product);
            if (!productExists) {
                return res.status(400).json({success: false, message: "Invalid product"});
            }
            variant.product = req.body.product;
        }

        variant.attributes = req.body.attributes ?? variant.attributes;
        variant.price = req.body.price ?? variant.price;
        variant.discountedPrice = req.body.discountedPrice ?? variant.discountedPrice;
        variant.countInStock = req.body.countInStock ?? variant.countInStock;
        variant.isActive = req.body.isActive ?? variant.isActive;
        variant.sku = req.body.sku ?? variant.sku;

        const updated = await variant.save();
        res.status(200).json({success: true, data: updated});

    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
});

//get ProductVarient Of a particular Product
router.get("/product/:productId", async (req, res) => {
    try {
        const variants = await ProductVariant.find({
            product: req.params.productId,
            isActive: true
        });

        res.status(200).json({success: true, data: variants});

    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
});
//delete ProductVarient
router.delete("/delete/:id", async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.id);
        if (!variant) {
            return res.status(404).json({success: false, message: "Variant not found"});
        }

        await variant.deleteOne();
        res.status(200).json({success: true, message: "Variant deleted successfully"});

    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
});

module.exports = router;