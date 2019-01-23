const User = require('mongoose').model('User');
const passport = require('passport');

const indexLogin = (req, res, next) => {
    res.render('auth/login');
};

const login = (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.render('auth/login', { error: { message: info['login-message'] }});

        req.logIn(user, err => {
            if (err) return next(err);
            res.redirect('/');
        });
    })(req, res, next);
};

const logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        req.logout();
        res.redirect('/');
    });
};

module.exports = {
    indexLogin,
    login,
    logout
}