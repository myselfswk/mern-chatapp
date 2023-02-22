const asyncHandler = require('express-async-handler');

const { Message } = require('../models/messageModel');
const { User } = require('../models/userModel');
const { Chat } = require('../models/chatModel');

// send Message Controller
const sendMessage = asyncHandler(async (req, res) => {
    // chat id on which we are suppose to send the message
    // actual message
    // who is the sender of the message
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        // console.log("Invalid data passed into request");
        res.sendStatus(400);
        throw new Error("Invalid data passed into request");
    }

    // Send New Message
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        var message = await Message.create(newMessage);

        // populate sender and message with id
        // user array inside chat id (eash user has id)
        // to populate an instance of mongoose class, we use execPopulate
        // .execPopulate()
        message = await message.populate("sender", "name pic");
        // .execPopulate();
        message = await message.populate("chat") // populate chat (populate everything from chat object)
        message = await User.populate(message, { //populate list of the user (with name pic & email)
            path: "chat.users",
            select: "name pic email",
        });

        // save latest message to chat to show that message on front
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Get all messages controller
const allMessages = asyncHandler(async (req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");

        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { sendMessage, allMessages }