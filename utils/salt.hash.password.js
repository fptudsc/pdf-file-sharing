const crypto = require('crypto');
const debug = require('debug')('password-util');

const getRandomString = length => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const sha512 = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const hashPassword = hash.digest('hex');
    
    return {
        salt, hashPassword
    };
};

const saltHashPassword = userpassword => {
    const salt = getRandomString(16);
    const passwordData = sha512(userpassword, salt);
    debug('Salt{}Hash{}Password');
    debug('UserPassword :', userpassword);
    debug('Salt :', passwordData.salt);
    debug('Hash :', passwordData.hashPassword);
    return passwordData;
};

const comparePassword = (password, salt, hash) => {
    const passwordData = sha512(password, salt);
    return hash === passwordData.hashPassword;
}

module.exports = {
    saltHashPassword,
    comparePassword
};