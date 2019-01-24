const User = require('mongoose').model('User');

const requireAuth = (req, res, next) => {
    const user = req.user;
    if (!user) return res.redirect('/auth/login');

    next();
};

const requireRole = roles => (req, res, next) => {
    User.findRolesByUserId(req.user.id, (err, userRoles) => {
        if (err) return next(err);
        if (roles.some(role => userRoles.includes(role))) {
            return next();
        }
        res.render('errors/role');
    });
};

module.exports = {
    requireAuth,
    requireRole
}