const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    password: String,
});

mongoose.model('User', userSchema);