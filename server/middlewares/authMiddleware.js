const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const { User } = require('../models/userModel');

// middleware for the user that are logged in
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // return user without password
            req.user = await User.findById(decoded.id).select("-password");
            next();

        } catch (error) {
            res.status(500);
            throw new Error("Not Authorize, Token Failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not Authorize, Token Failed");
    }
});

module.exports = { protect };