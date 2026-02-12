const express = require("express");
const router = express.Router();

const Address = require("../models/Address");
const {authenticateToken} = require("../Auth/authUser");

//add address
router.post("/add", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            fullName,
            phone,
            addressLine,
            city,
            state,
            landmark,
            pincode,
            isDefault,
        } = req.body;

        // If first address → make default automatically
        const existingAddresses = await Address.find({user: userId});

        let makeDefault = false;

        if (existingAddresses.length === 0) {
            makeDefault = true;
        } else if (isDefault) {
            // Remove previous default
            await Address.updateMany(
                {user: userId},
                {$set: {isDefault: false}}
            );
            makeDefault = true;
        }

        const newAddress = new Address({
            user: userId,
            fullName,
            phone,
            addressLine,
            city,
            state,
            landmark,
            pincode,
            isDefault: makeDefault,
        });

        await newAddress.save();

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            address: newAddress,
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get user address
router.get("/", authenticateToken, async (req, res) => {
    try {
        const addresses = await Address.find({user: req.user.id})
            .sort({isDefault: -1, createdAt: -1});

        res.json({
            success: true,
            addresses,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//update address
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;

        const existing = await Address.findOne({
            _id: addressId,
            user: userId,
        });

        if (!existing) {
            return res.status(404).json({message: "Address not found"});
        }

        // If setting as default → remove previous default
        if (req.body.isDefault) {
            await Address.updateMany(
                {user: userId},
                {$set: {isDefault: false}}
            );
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            req.body,
            {new: true}
        );

        res.json({
            success: true,
            message: "Address updated successfully",
            address: updatedAddress,
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//delete address
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;

        const address = await Address.findOneAndDelete({
            _id: addressId,
            user: userId,
        });

        if (!address) {
            return res.status(404).json({message: "Address not found"});
        }

        // If deleted address was default → assign another as default
        if (address.isDefault) {
            const anotherAddress = await Address.findOne({user: userId});

            if (anotherAddress) {
                anotherAddress.isDefault = true;
                await anotherAddress.save();
            }
        }

        res.json({
            success: true,
            message: "Address deleted successfully",
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//set default address
router.put("/set-default/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;

        const addressExists = await Address.findOne({
            _id: addressId,
            user: userId,
        });

        if (!addressExists) {
            return res.status(404).json({message: "Address not found"});
        }

        // Remove previous default
        await Address.updateMany(
            {user: userId},
            {$set: {isDefault: false}}
        );

        addressExists.isDefault = true;
        await addressExists.save();

        res.json({
            success: true,
            message: "Default address updated successfully",
            address: addressExists,
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;