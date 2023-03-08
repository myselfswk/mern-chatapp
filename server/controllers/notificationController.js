const asyncHandler = require('express-async-handler');

const { Notification } = require('../models/notificationModel');

// Add Notification Controller
const addNotifications = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        res.sendStatus(400);
        throw new Error("Invalid data passed into request");
    }

    // Send New Notification
    var newNotif = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        var notification = await Notification.create(newNotif);
        res.json(notification);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Remove Notification Controller
const removeNotification = asyncHandler(async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Notification Deleted Successfuly" });

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {
    addNotifications,
    removeNotification
}