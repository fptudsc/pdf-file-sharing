const mongoose = require('mongoose');
const debug = require('debug')('mongoose');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500
};

const connect = (url) => {
    debug('Connecting to MongoDB');
    mongoose.connect(url, options)
        .then(() => {
            debug('Connected');
        })
        .catch(err => {
            debug(err);
        });
};

const connectToLocalhost = () => {
    // customize your MONGO_URL in .env file
    connect(process.env.MONGO_URL);
};

const connectToMlab = () => {
    // customize your MLAB_URL in .env file
    connect(process.env.MLAB_URL);
};

module.exports = {
    connectToLocalhost,
    connectToMlab
}