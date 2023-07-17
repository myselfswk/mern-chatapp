const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Contact = mongoose.model("contact", contactSchema);
module.exports = { Contact };