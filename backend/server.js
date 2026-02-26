const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require("dotenv").config();
require("./connection/conn");

// Middleware
app.use(cors());
app.use(express.json({limit: "10mb"})); // replaces body-parser
app.use(express.urlencoded({extended: true, limit: "10mb"}));

// Import Routes
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const varientRoutes = require('./routes/productVarient');
const catalogRoutes = require('./routes/catalog');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const RatingRoutes = require('./routes/Rating');
const ReviewRoutes = require('./routes/Review');
const orderRoutes = require('./routes/order');
const addressRoutes = require('./routes/address');
const searchRoutes = require('./routes/Search');
const newProductRoutes = require('./routes/newProducts');
const recentlyViewedRoutes = require('./routes/recentlyViewed');
const relatedProductsRoutes = require('./routes/relatedProducts');
const topDealRoutes = require('./routes/topDeals');
const featuredProductRoutes = require('./routes/FeaturedProducts');


// Use Routes
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/varient", varientRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/rating", RatingRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recentlyViewed", recentlyViewedRoutes);
app.use("/api/relatedProducts", relatedProductsRoutes);
app.use("/api/newProduct", newProductRoutes);
app.use("/api/topDeals", topDealRoutes);
app.use("/api/featuredProducts", featuredProductRoutes);

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
