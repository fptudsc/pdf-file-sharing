const User = require('mongoose').model('User');

const viewProfile = async (req, res) => {

};

const createAccount = (req, res) => {
    res.render('user/createAccount');
};

const register = async (req, res, next) => {
    const { username, password }  = req.body;

    const user = new User();
    user.username = username;
    user.setPassword(password);

    user.save((err, user) => {
        if (err) return next(err);
        console.log('Saved :', user);
        res.redirect('/');
    });
}

module.exports = {
    viewProfile,
    createAccount,
    register
};