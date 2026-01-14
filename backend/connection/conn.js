const mongoose = require('mongoose');

const conn = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

conn();