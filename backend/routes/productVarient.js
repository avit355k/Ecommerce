const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const ProductVariant = require('../models/ProductVariant');

//generate SKU
const generateSKU = (product, attributes = {}) => {
    const namePart = product.name
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 5)
        .toUpperCase();

    const attrPart = Object.values(attributes)
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 6)
        .toUpperCase();

    const timePart = Date.now().toString().slice(-5);

    return `${namePart}-${attrPart}-${timePart}`;
};

const createUniqueSKU = async (product, attributes) => {
    let sku;
    let exists = true;

    while (exists) {
        sku = generateSKU(product, attributes);
        exists = await ProductVariant.exists({ sku });
    }

    return sku;
};


//Add Product Varient
router.post("/product/:productId/add", async (req, res) => {
    try {
        const { productId } = req.params;
        const { attributes, price, discountedPrice, countInStock, isActive } = req.body;

        if (!price || countInStock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Price and count in stock are required"
            });
        }

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const sku = await createUniqueSKU(productExists, attributes);

        const variant = new ProductVariant({
            product: productId,
            attributes,
            price,
            discountedPrice,
            countInStock,
            isActive,
            sku
        });

        const savedVariant = await variant.save();

        res.status(201).json({
            success: true,
            data: savedVariant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET ALL PRODUCTS WITH THEIR VARIANTS
router.get("/all-products", async (req, res) => {
    try {
        // Fetch all products
        const products = await Product.find()
            .populate("category", "name slug");

        if (!products.length) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Fetch all active variants
        const variants = await ProductVariant.find({ isActive: true });

        // Group variants by productId
        const variantMap = {};

        variants.forEach(variant => {
            const productId = variant.product.toString();
            if (!variantMap[productId]) {
                variantMap[productId] = [];
            }
            variantMap[productId].push(variant);
        });

        // Combine product + variant data
        const result = products.map(product => {
            const productVariants = variantMap[product._id.toString()] || [];

            let minPrice = null;
            let maxPrice = null;
            let totalStock = 0;

            productVariants.forEach(v => {
                const price = v.discountedPrice || v.price;
                minPrice = minPrice === null ? price : Math.min(minPrice, price);
                maxPrice = maxPrice === null ? price : Math.max(maxPrice, price);
                totalStock += v.countInStock;
            });

            return {
                product,
                variants: productVariants,
                priceRange: productVariants.length
                    ? { min: minPrice, max: maxPrice }
                    : null,
                totalStock,
                totalVariants: productVariants.length
            };
        });

        res.status(200).json({
            success: true,
            totalProducts: result.length,
            data: result
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

//get Full Product Details along with Varient (PRODUCT + VARIANTS )
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        //Fetch product
        const product = await Product.findById(productId)
            .populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Fetch variants
        const variants = await ProductVariant.find({
            product: product._id,
            isActive: true,
        });

        //  Aggregate pricing & stock
        let minPrice = null;
        let maxPrice = null;
        let totalStock = 0;

        variants.forEach(v => {
            const price = v.discountedPrice || v.price;

            minPrice = minPrice === null ? price : Math.min(minPrice, price);
            maxPrice = maxPrice === null ? price : Math.max(maxPrice, price);

            totalStock += v.countInStock;
        });

        res.status(200).json({
            success: true,
            data: {
                product,
                variants,
                priceRange: { min: minPrice, max: maxPrice },
                totalStock,

            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//get ProductVarient Of a particular Product
router.get("/product/:productId/list", async (req, res) => {
    try {
        const variants = await ProductVariant.find({
            product: req.params.productId,
            isActive: true
        });

        res.status(200).json({ success: true, data: variants });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET ALL AVAILABLE VARIANTS (Active + In Stock)
router.get("/available", async (req, res) => {
    try {
        const variants = await ProductVariant.find({
            isActive: true,
            countInStock: { $gt: 0 }
        })
            .populate({
                path: "product",
                select: "name description images category",
                populate: {
                    path: "category",
                    select: "name slug"
                }
            });
        const filteredVariants = variants.filter(v => v.product !== null);

        res.status(200).json({
            success: true,
            totalVariants: filteredVariants.length,
            data: filteredVariants
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

//Edit Product Varient
router.put("/:variantId", async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        Object.assign(variant, req.body);

        const updated = await variant.save();
        res.status(200).json({ success: true, data: updated });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

//delete ProductVarient
router.delete("/:variantId", async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        await variant.deleteOne();
        res.status(200).json({ success: true, message: "Variant deleted successfully" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;