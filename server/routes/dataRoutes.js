const router = require('express').Router();

const { chats } = require('../data/data');

// Get Dummy Data (all chats)
router.get('/data', (req, res) => {
    res.send(chats);
});

// Get Specific chat by id
router.get('/data/:id', (req, res) => {
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat);
});

module.exports = router;