const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/dw2gks8uv/image/upload/v1771607674/user-png_vhg2dz.png"
        },
        public_id: {
            type: String,
            default: ""
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("user", userSchema);