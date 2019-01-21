const User = require('mongoose').model('User');

const viewProfile = async (req, res) => {

};

const createAccount = (req, res) => {
    res.render('user/createAccount');
};

const register = async (req, res, next) => {
    const { username, password }  = req.body;

    const newUser = new User({ username, password });
    newUser.save((err, user) => {
        if (err) return next(err);
        console.log('Saved :', user);
        res.send(user);
    });
}

module.exports = {
    viewProfile,
    createAccount,
    register
};