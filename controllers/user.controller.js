const User = require('mongoose').model('User');

const viewProfile = async (req, res) => {
    User.findById(req.user.id, (err, user) => {
        const profile = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        };
        
        res.render('users/profile', {
            profile,
            csrfToken: req.csrfToken()
        });
    })
};

const viewOwnSources = (req, res) => {
    res.render('sources/index');
};

const changePassword = (req, res, next) => {
    const errors = req.flash('password-errors');
    res.render('users/password', {
        errors,
        csrfToken: req.csrfToken()
    });
}

const postChangePassword = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) return next(err);
        
        const errors = [];
        const { password, password1, password2 } = req.body;

        if (! (password1 && password2)) {
            errors.push('Please fullfill the form');
        }

        if (password1 !== password2) {
            errors.push('Password not match');
        }

        if (user.salt && user.hash && !user.validPassword(password)) {
            errors.push('Password incorrect');
        }

        if (errors.length > 0) {
            req.flash('password-errors', errors);
            return res.redirect('/users/changePassword');
        }

        user.setPassword(password1);
        user.save((err, user) => {
            if (err) return next();
            res.redirect('/users/viewProfile');
        });
    })
}
module.exports = {
    viewProfile,
    viewOwnSources,
    changePassword,
    postChangePassword
};