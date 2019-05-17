const User = require('mongoose').model('User');

const transformReqBody = (req, res, next) => {
    const { 
        firstName,
        lastName,
        username,
        password,
        email
    } = req.body;

    if (
        ! (firstName &&
        lastName &&
        username &&
        email)
    ) {
        return res.send({
            message: 'Please fullfill the form',
            error: []
        });
    }

    User.findById(req.user.id, (err, foundUser) => {
        if (err) return next(err);

        if (foundUser.salt && foundUser.hash && !foundUser.validPassword(password)) {
            return res.send({
                message: 'Password incorrect',
                error: []
            });
        }

        req.body = { firstName, lastName, username, email };
        next();
    });
}

module.exports = {
    transformReqBody
}