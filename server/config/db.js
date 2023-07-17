const mongoose = require('mongoose');
require('colors');

module.exports = () => {
    mongoose.set('strictQuery', false);

    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database Successfully'.green.bold);
    } catch (error) {
        console.log('Could not Connected to DB...'.red.bold, error);
    }
}