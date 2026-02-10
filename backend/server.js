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

// Use Routes
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/varient", varientRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
