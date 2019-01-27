const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500
};

const connect = (url) => {
    mongoose.connect(url, options)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.err(err);
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