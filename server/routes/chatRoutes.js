const router = require('express').Router();

const { protect } = require('../middlewares/authMiddleware');
const { accessChat, fetchChat, createGropuChat, renameGroup, removeFromGroup, addtoGroup } = require('../controllers/chatController');

// access the chat and create the chat ('/')
router.route('/').post(protect, accessChat);

// fetch the chat's data from database
router.route('/').get(protect, fetchChat);

// create group chat
router.route('/group').post(protect, createGropuChat);

// Update group name
router.route('/rename').put(protect, renameGroup);

// Remove from Group Route
router.route('/groupremove').put(protect, removeFromGroup);

// Add to group route
router.route('/groupadd').put(protect, addtoGroup);

module.exports = router;