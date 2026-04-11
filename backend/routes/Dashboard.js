const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Order = require("../models/Order");
const Product = require("../models/product");
const ProductVariant = require("../models/ProductVariant");
const Category = require("../models/category");

const { getAllChildCategories } = require("../utils/category");

//get dashboard stats data
router.get("/", async (req,res)=>{
    try{
        // 1. Basic Counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        // 2. Total Revenue (only paid orders)
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    "paymentInfo.status": "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {$sum: "$totalAmount"},
                }
            },
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // 3. Orders by Status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
            ]);
        const allStatuses = [
            "processing",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ];

        //Convert to Object
        const formattedStatus = {};

        allStatuses.forEach(status => {
            formattedStatus[status] = 0;
        });

        ordersByStatus.forEach(item => {
            formattedStatus[item._id] = item.count;
        });
        
        // 4. Recent Orders
        const recentOrders = await Order.find()
            .populate("user", "name email")
            .populate({
                path: "items.product",
                select: "name images description"
            })
            .sort({ createdAt: -1 })
            .limit(5);

        // 5. Low Stock Products (variants)
        const lowStockProducts = await ProductVariant.find({
            countInStock: { $lt: 10 }
        })
            .populate("product", "name images")
            .limit(5);

        res.status(200).json({
            status: "success",
            data: { totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                ordersByStatus: formattedStatus,
                recentOrders,
                lowStockProducts,
            }
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Dashboard data fetch failed"
        });
    }
});

//get top sales products
router.get("/top-sales", async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },

            {
                $group: {
                    _id: {
                        product: "$items.product",
                        variant: "$items.variant"
                    },
                    totalSold: { $sum: "$items.quantity" }
                }
            },

            { $sort: { totalSold: -1 } },
            { $limit: 5 },

            //  Lookup Product
            {
                $lookup: {
                    from: "products",
                    localField: "_id.product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "productvariants",
                    localField: "_id.variant",
                    foreignField: "_id",
                    as: "variant"
                }
            },

            { $unwind: "$product" },
            { $unwind: "$variant" },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 0,
                    totalSold: 1,
                    product: {
                        _id: "$product._id",
                        name: "$product.name",
                        images: "$product.images",
                        description: "$product.description",
                        category: "$category.name",
                        brand: "$product.brand",
                        rating: "$product.averageRating",
                    },
                    variant: {
                        _id: "$variant._id",
                        price: "$variant.price",
                        discountedPrice: "$variant.discountedPrice",
                        attributes: "$variant.attributes"
                    }
                }
            }
        ]);

        res.status(200).json({
            status: "success",
            data: { topProducts }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Top sales fetch failed"
        });
    }
});

//get category sales percentage
router.get("/category-sales", async (req, res) => {
    try {
        // 1. Get all categories
        const categories = await Category.find();

        // 2. Filter only MAIN categories (level-0)
        const mainCategories = categories.filter(cat => cat.level === 0);

        // 3. Build category map (main -> all children)
        const categoryMap = {};

        mainCategories.forEach(cat => {
            const children = getAllChildCategories(categories, cat._id);
            categoryMap[cat._id] = [cat._id, ...children];
        });

        // 4. Get sales data with product category
        const salesData = await Order.aggregate([
            {
                $match: { "paymentInfo.status": "paid" }
            },
            { $unwind: "$items" },

            // Lookup product to get category
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },

            {
                $project: {
                    category: "$product.category",
                    total: {
                        $multiply: ["$items.quantity", "$items.price"]
                    }
                }
            }
        ]);

        // 5. Initialize result object
        let categorySales = {};
        let totalSales = 0;

        mainCategories.forEach(cat => {
            categorySales[cat._id.toString()] = {
                name: cat.name,
                total: 0
            };
        });

        // 6. Calculate sales
        salesData.forEach(item => {
            if (!item.category) return;

            const itemCategory = item.category.toString();
            totalSales += item.total;

            for (let mainCatId in categoryMap) {
                const categoryIds = categoryMap[mainCatId].map(id =>
                    id.toString()
                );

                if (categoryIds.includes(itemCategory)) {
                    categorySales[mainCatId].total += item.total;
                    break;
                }
            }
        });

        // 7. Convert to percentage
        const result = Object.values(categorySales).map(cat => ({
            name: cat.name,
            totalSales: cat.total,
            percentage: totalSales
                ? ((cat.total / totalSales) * 100).toFixed(2)
                : "0.00"
        }));

        res.status(200).json({
            status: "success",
            data: result
        });

    } catch (error) {
        console.error("CATEGORY SALES ERROR:", error);
        res.status(500).json({
            status: "error",
            message: "Category sales fetch failed"
        });
    }
});

//get monthly revenue and avg Revenue for Graph.
router.get("/monthly-revenue", async (req, res) => {
    try {
        // 1. Aggregate revenue + order count per month
        const monthlyData = await Order.aggregate([
            {
                $match: {
                    "paymentInfo.status": "paid"
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Month labels
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // 3. Format monthly revenue
        let monthlyRevenue = [];
        let monthlyAvgRevenue = [];

        months.forEach((month, index) => {
            const found = monthlyData.find(
                item => item._id === index + 1
            );

            const revenue = found ? found.revenue : 0;
            const orders = found ? found.orders : 0;

            monthlyRevenue.push({
                month,
                revenue
            });

            monthlyAvgRevenue.push({
                month,
                revenue: orders > 0
                    ? parseFloat((revenue / orders).toFixed(2))
                    : 0
            });
        });

        // 4. Total & overall avg
        const totalRevenue = monthlyRevenue.reduce(
            (sum, item) => sum + item.revenue,
            0
        );

        const avgRevenue =
            totalRevenue > 0
                ? (totalRevenue / 12).toFixed(2)
                : "0.00";

        res.status(200).json({
            status: "success",
            data: {
                monthlyRevenue,
                monthlyAvgRevenue,
                totalRevenue,
                avgRevenue
            }
        });

    } catch (error) {
        console.error("MONTHLY REVENUE ERROR:", error);
        res.status(500).json({
            status: "error",
            message: "Monthly revenue fetch failed"
        });
    }
});

module.exports = router;