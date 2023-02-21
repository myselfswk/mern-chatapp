const router = require('express').Router();

const { sendMessage, allMessages } = require('../controllers/messageControllers');
const { protect } = require('../middlewares/authMiddleware');

// get all messages Route (all the messages from single chat)
router.route('/:chatId').get(protect, allMessages);

// send message Route
router.route('/').post(protect, sendMessage);

module.exports = router;