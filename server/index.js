const express = require('express');
// now, create instance of express
const app = express();
const dotenv = require('dotenv');

const connection = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');
require('colors');

dotenv.config();

// Adding Database
connection();

// use app
app.get('/', (req, res) => {
    res.send("API is Running");
});

// use Demo Data Routes
app.use('/api/', dataRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App is Up and Running at PORT: ${port}`.yellow.bold));