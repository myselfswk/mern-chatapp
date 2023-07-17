const asyncHandler = require('express-async-handler');

const { Contact } = require('../models/contactModel');
const { NewsLetter } = require('../models/newsletterModel');

// Specially for portfolio website
// Send Message Controller
const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, message } = req.body;
        if (!firstname || !lastname || !email || !phonenumber || !message) return res.status(400).send("Please fill all the Fields");

        // Validate email
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return res.status(400).send('Invalid email format');

        await Contact.create(req.body);
        res.status(201).send("Send Message Successfully");

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get All COntact Us Message for admin panel Controller
const getMessages = asyncHandler(async (req, res) => {
    try {
        const getMessages = await Contact.find().sort({ _id: -1 });
        const check = Object.keys(getMessages).length;
        if (check === 0) return res.status(400).send("No Contact us Messages");

        res.status(200).send(getMessages);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// newsletter Controller
const newsLetters = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send("Please Enter Email Address");

        // Validate email
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return res.status(400).send('Invalid email format');

        await NewsLetter.create(req.body);
        res.status(201).send('Your Email Added to Our NewsLetters');

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = {
    sendMessage,
    getMessages,
    newsLetters
}