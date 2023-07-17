const mongoose = require('mongoose');

const newsLetterSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
}, { timestamps: true });

const NewsLetter = mongoose.model("newsletter", newsLetterSchema);
module.exports = { NewsLetter };