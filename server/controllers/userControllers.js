const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const { User } = require('../models/userModel');
const generateToken = require('../config/generateToken');

// Register User Controller
const userRegister = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter All Fields");
        }

        // check if user is exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400);
            throw new Error("User Already Exist");
        }

        // if not user in the database, we create it
        const user = await User.create({ name, email, password, pic });
        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                pic: user.pic
            });
        } else {
            res.status(400);
            throw new Error("Failed to create the User");
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Login Controller
const authUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                pic: user.pic
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Get All User Controller (For Search)
const allUsers = asyncHandler(async (req, res) => {
    try {
        // search if there is any query inside keyword
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {}

        // find all the user but not that one who is logged in
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        res.send(users);

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Get All User Controller
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        // find all the user but not that one who is logged in
        const users = await User.find({ _id: { $ne: req.user._id } });
        res.send(users);

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Update User Controller
const updateUser = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.body.name) {
            res.status(400);
            throw new Error("Please Enter Name Fields");
        }
        const updatedData = {
            name: req.body.name,
            pic: req.body.pic
        }
        const options = { new: true };

        const result = await User.findByIdAndUpdate(id, updatedData, options);
        res.status(200).send({
            message: "User Successfully Updated..!",
            Name: result.name
        });

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Change Password For User By ID Controller
// change password in case you forgot
const editPasswordUser = asyncHandler(async (req, res) => {
    try {
        // get id and current & new password
        const { id } = req.params;
        const { newPassword } = req.body;

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(newPassword, salt);

        const updatedData = { password: hashPassword }
        const options = { new: true };

        await User.findByIdAndUpdate(id, updatedData, options);
        res.status(200).send("Password has been Updated...!");

    } catch (error) {
        res.json(sendResponse(false, error.message));
    }
})

module.exports = { userRegister, authUser, allUsers, getAllUsers, updateUser, editPasswordUser };