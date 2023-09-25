const asyncHandler = require('express-async-handler');

const { Chat } = require('../models/chatModel');
const { User } = require('../models/userModel');

// Access chats with specific user Controller
// One on One Chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400);
        throw new Error("User ID Params not send with request");
    }

    // check if chat with this user exist, we have all the final data in isChat
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage");
    // users array in chat model (except password)

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            // create chat
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat.id }).populate("users", "-password");
            res.status(200).send(fullChat);

        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

// Fetch Chats data Controller
const fetchChat = asyncHandler(async (req, res) => {
    try {
        // check which user is logged in and find all his/her chats
        // user._id, the user who is logged In
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage")
            .sort({ updatedAt: -1 }).then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                })
                res.status(200).send(result);
            })
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Create Group Chat Controller
const createGropuChat = asyncHandler(async (req, res) => {
    // we let bunch of users from the body in order to create group with multiple users
    // and name of the group chat
    if (!req.body.users || !req.body.name) {
        return res.status(400).send("Please fill all the fields");
    }

    // get all the users from the body
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than two users are required to form a group chat");
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        // now, fetch group chat from database and show it to the user
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).send(fullGroupChat);

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Rename Group name Controller
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName: chatName },
        { new: true } // if not, it will return old name
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).send(updatedChat);
    }
});

// Add User to Group Controller
const addtoGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // now, add users
    const added = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).send(added);
    }
});

// Remove user from group Controller
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // now, add users
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).send(removed);
    }
});

module.exports = {
    accessChat,
    fetchChat,
    createGropuChat,
    renameGroup,
    removeFromGroup,
    addtoGroup
}