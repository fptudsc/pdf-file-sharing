const mongoose = require('mongoose');
const { saltHashPassword, comparePassword } = require('../utils/salt.hash.password');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    saltPassword: {
        type: String,
        alias: 'salt',
        required: true
    },
    hashPassword: {
        type: String,
        alias: 'hash',
        required: true
    },
    roles: {
        type: [{
            type: String,
            enum: ['reader', 'admin', 'writer', 'editor'],
        }],
        required: true
    }
});

userSchema.methods.setPassword = function (pwd) {
    const pwdCrypto = saltHashPassword(pwd);
    this.salt = pwdCrypto.salt;
    this.hash = pwdCrypto.hashPassword;
    console.log(this);
};

userSchema.methods.validPassword = function (pwd) {
    return comparePassword(pwd, this.salt, this.hash);
};

userSchema.statics.findByUsername = function (username, cb) {
    this.findOne({ username }, cb);
};

userSchema.pre('save', function(next) {
    this.roles.push('reader');
    next();
});

userSchema.static.getRolesByUserId = function (id, cb) {
    this.findById(id).select('roles').exec(cb);
};

mongoose.model('User', userSchema);