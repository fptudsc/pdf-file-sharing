const validator = require('validator');

module.exports.validate = (req, res, next) => {
    const user = req.body;
    const errors = {};
    if (validator.isEmpty(user.username))
        errors.username = 'Please enter Username';
    
    if (validator.isEmpty(user.password))
        errors.password = 'Please enter Password';
    
    if (user.password !== user.passwordPair)
        errors.passwordPair = 'Password not match';

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
        req.flash('errors-validate', errors);
        req.flash('user-inputs', user);
        res.redirect('/auth/register');
        return;
    }

    next();
}