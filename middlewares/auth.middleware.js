const User = require('mongoose').model('User');

const requireAuth = (req, res, next) => {
    const user = req.user;
    if (!user) return res.redirect('/auth/login');

    next();
};

const requireRole = roles => (req, res, next) => {

};

module.exports = {
    requireAuth,
    requireRole
}