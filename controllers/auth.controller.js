const User = require('mongoose').model('User');

const indexLogin = (req, res, next) => {
    res.render('auth/login');
};

const login = (req, res, next) => {
    const { username, password} = req.body;
    
    User.findByUsername(username, (err, user) => {
        const errors = [];
        if (err) return next(err);
        if (!user) {
            errors.push('Username not found');
        }

        if (user && !user.validPassword(password)) {
            errors.push('Password incorrect');
        }

        if (errors.length) {
            return res.render('auth/login', {
                errors
            });
        }

        res.redirect('/');
    });
};

module.exports = {
    indexLogin,
    login
}