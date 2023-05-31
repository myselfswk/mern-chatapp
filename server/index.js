const express = require('express');
// now, create instance of express
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connection = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const { errorHandler, notFound } = require('./middlewares/errorMiddlewares');
require('colors');

dotenv.config();

// Add middleware
// For Frontend to accept json data
app.use(express.json());

// Adding Database
connection();

// use app
app.get('/', (req, res) => {
    res.send("API is Running");
});

// use Routes (end points)
app.use('/api/', dataRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Configure CORS
const corsOptions = {
    origin: 'https://chatapp-mernapp.vercel.app',
    methods: ['GET', 'POST', 'PUT'],
};

// error handling function or middlewares
app.use(notFound);
app.use(errorHandler);
app.use(cors(corsOptions));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`App is Up and Running at PORT: ${port}`.yellow.bold));

// setup socket io
const io = require('socket.io')(server, {
    // amount of time it will wait before it will gose of
    // for 60 sec, if user doesn't respond/message, the socket gonna close the connection (in order to save the bandwidth)
    pinTimeOut: 60000,
    cors: {
        origin: "https://chatapp-mernapp.vercel.app"
    }
});

// now create a connection
io.on("connection", (socket) => {
    // everytime user open app, he/she connected to his/her on socket
    // it will take the user data from the client
    // frontend will send the data and join the room
    socket.on('setup', (userData) => {
        // create new room with the id of the user (exclusive for that particular user)
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    // now, socket for join chat
    // take room id from the frontend
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    // new room for user typing
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    // new room for user stop typing
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // send message functionality
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat; //has chat id (chat data)

        if (!chat.users) return console.log("chat.users not defined");

        // emit message to all the users in the chat room
        // message notification will receive to all the participants excepts the sender
        chat.users.forEach((user) => {
            // sent by user logged In
            if (user._id == newMessageRecieved.sender._id) return;

            // for other user, sent this message and notify
            // in means inside that user's room, emit send the message
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    // off socket in order to save bandwidth
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
