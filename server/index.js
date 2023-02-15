const express = require('express');
// now, create instance of express
const app = express();
const dotenv = require('dotenv');

const connection = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
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

// error handling function or middlewares
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App is Up and Running at PORT: ${port}`.yellow.bold));