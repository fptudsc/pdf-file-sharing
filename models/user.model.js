const mongoose = require('mongoose');
const { saltHashPassword, comparePassword } = require('../utils/salt.hash.password');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    saltPassword: {
        type: String,
        alias: 'salt',
    },
    hashPassword: {
        type: String,
        alias: 'hash',
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    roles: {
        type: [{
            type: String,
            enum: [ 'reader', 'admin', 'uploader', 'editor' ],
        }],
        required: true
    },
    profile_picture: String,
    email: String,
    social: {
        type: Schema.Types.Mixed
    }
});

userSchema.methods.setPassword = function (pwd) {
    const pwdCrypto = saltHashPassword(pwd);
    this.salt = pwdCrypto.salt;
    this.hash = pwdCrypto.hashPassword;
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

userSchema.statics.getRolesByUserId = function (id, cb) {
    this.findById(id).select('roles').exec(cb);
};

mongoose.model('User', userSchema);