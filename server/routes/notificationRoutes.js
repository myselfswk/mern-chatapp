const router = require('express').Router();

const { addNotifications, removeNotification } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
const { isValidObjectId } = require('../middlewares/isValidObjectId');

// Add Notification Route
router.post('/', protect, addNotifications);

// Delete Notification Route
router.delete('/:id', isValidObjectId, protect, removeNotification);

module.exports = router;