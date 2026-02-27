const User = require('../models/user');
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require("../Auth/authUser");
const {uploadSingle} = require("../middlewares/multer");
const {avatarUploadImage, deleteImage} = require("../utils/cloudinary");


//sign up
router.post('/signup', async (req, res) => {

    try {
        const {name, phone, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        const existingUser = await User.findOne({email: email});

        if (existingUser) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashedPassword
        });

        console.log("User signed up:", result);
        return res.status(200).json({success: true, message: "User created successfully", user: result,});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
});

//sign-in
router.post('/signin', async (req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email: email});

        if (!existingUser) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id
        }, process.env.Jwt_key, {expiresIn: "12h"});

        res.status(200).json({
            success: true,
            message: "User Signed in successfully",
            user: existingUser,
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
});

//Sign-in with Google
router.post('/authWithGoogle', async (req, res) => {
    try {
        const {name, email, avatar} = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        //Check if user already exists with this email
        let user = await User.findOne({email});

        if (user) {
            // USER ALREADY EXISTS (normal signup user)
            // Just login with existing details
            const token = jwt.sign(
                {email: user.email, id: user._id},
                process.env.Jwt_key,
                {expiresIn: "12h"}
            );

            return res.status(200).json({
                success: true,
                message: "Logged in with existing account",
                user,
                token
            });
        }

        // New Google user → Create account

        // Generate random password
        const randomPassword = await bcrypt.hash(
            Math.random().toString(36).slice(-8),
            10
        );

        const newUser = await User.create({
            name: name,
            email: email,
            phone: undefined, // user can edit later
            password: randomPassword,
            avatar: {
                url: avatar || "https://res.cloudinary.com/dw2gks8uv/image/upload/v1771607674/user-png_vhg2dz.png",
                public_id: ""
            }
        });

        const token = jwt.sign(
            {email: newUser.email, id: newUser._id},
            process.env.Jwt_key,
            {expiresIn: "12h"}
        );

        return res.status(200).json({
            success: true,
            message: "Google account created successfully",
            user: newUser,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

//get all users
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userList = await User.find();

        if (!userList || userList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }

        return res.status(200).json({
            success: true,
            users: userList,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

//get count of users
router.get('/get/count', authenticateToken, async (req, res) => {
    try {
        const userCount = await User.countDocuments();

        return res.status(200).json({success: true, userCount});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
});

//get user by id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(error);

        // Handles invalid ObjectId error
        return res.status(500).json({
            success: false,
            message: "Invalid user ID or Internal Server Error",
        });
    }
});

//update user by id
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const {name, phone, email, password} = req.body;
        const userexits = await User.findById(req.params.id);
        let newPassword;
        if (password) {
            newPassword = await bcrypt.hash(password, 10);
        } else {
            newPassword = userexits.password;
        }

        const user = await User.findByIdAndUpdate(req.params.id, {
                name: name,
                phone: phone,
                email: email,
                password: newPassword
            },
            {new: true}
        );

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        return res.status(200).json({success: true, message: "User updated successfully", user});

    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
})

//add edit avatar
router.put('/:id/avatar', authenticateToken, uploadSingle, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        if (!req.file) {
            return res.status(400).json({success: false, message: "No image uploaded"});
        }

        // delete old image if exists
        if (user.avatar?.public_id) {
            await deleteImage(user.avatar.public_id);
        }

        const uploaded = await avatarUploadImage(req.file, "Avatar");

        user.avatar = {
            url: uploaded.url,
            public_id: uploaded.public_id
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            avatar: user.avatar
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
});

//delete user by id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        User.findByIdAndDelete(req.params.id).then((deletedUser) => {
            if (deletedUser) {
                return res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
                    user: deletedUser,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

module.exports = router;