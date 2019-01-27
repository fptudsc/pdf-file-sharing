const User = require('mongoose').model('User');
const passport = require('passport');

const indexLogin = (req, res, next) => {
    res.render('auth/login');
};

const login = (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        // get the current-request-url from auth middleware
        // if non-exist, set default '/'
        const currentUrl = req.flash('current-request-url')[0] || '/';

        if (err) return next(err);
        if (!user) return res.render('auth/login', { error: { message: info['login-message'] }});

        req.logIn(user, err => {
            if (err) return next(err);
            // redirect user back to the url required
            res.redirect(currentUrl);
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

const register = (req, res) => {
    const errors = req.flash('errors-validate')[0] || {}; // validate failed
    const user = req.flash('user-inputs')[0] || {};

    res.render('user/createAccount', {
        user,
        errors
    });
};

const postRegister = async (req, res, next) => {
    const { firstName, lastName, username, password }  = req.body;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    // salt, hash will be saved instead plainTextPassword
    user.setPassword(password);

    user.save((err, user) => {
        if (err) return next(err);

        // login after saving user
        req.logIn(user, err => {
            if (err) return next(err);
            res.redirect('/');
        })
    });
}

module.exports = {
    indexLogin,
    login,
    logout,
    register,
    postRegister
}