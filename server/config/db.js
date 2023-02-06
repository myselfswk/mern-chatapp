const mongoose = require('mongoose');
require('colors');

module.exports = () => {
    mongoose.set('strictQuery', false);

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    try {
        mongoose.connect(process.env.MONGO_URI, connectionParams);
        console.log('Connected to Database Successfully'.green.bold);
    } catch (error) {
        console.log(error);
        console.log('Could not Connected to DB...'.red.bold);
    }
}