const router = require('express').Router();

const { sendMessage, getMessages, newsLetters } = require('../controllers/contactController');

// Specially For Portfolio Website
// Send Message Route
router.post('/sendmessage', sendMessage);

// Get All COntact Us Message for admin panel Route
router.get('/getmessages', getMessages);

// newsletter Route
router.post('/newsletter', newsLetters);

module.exports = router;