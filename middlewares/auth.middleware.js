const User = require('mongoose').model('User');

const requireAuth = (req, res, next) => {
    const user = req.user;
    // set original url to specific what url user want to access
    req.flash('current-request-url', req.originalUrl);
    // redirect to /auth/login if non-authentication
    // original url will be used to redirect after login successfully
    if (!user) return res.redirect('/auth/login');

    next();
};

const requireRole = roles => (req, res, next) => {
    // get all the roles of the current login user
    User.getRolesByUserId(req.user.id, (err, user) => {
        if (err) return next(err);

        // if they have one of the role required
        if (roles.some(role => user.roles.includes(role))) {
              // you are permited
            return next();
        }
        // forbidden
        res.render('errors/authorized');
    });
};

module.exports = {
    requireAuth,
    requireRole
}