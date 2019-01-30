const User = require('mongoose').model('User');

const transformReqBody = (req, res, next) => {
    const user = JSON.parse(req.body.encodedObj);

    if (
        ! (user.firstName &&
        user.lastName &&
        user.username &&
        user.email)
    ) {
        return res.send({
            message: 'Please fullfill the form',
            error: []
        });
    }

    User.findById(req.user.id, (err, foundUser) => {
        if (err) return next(err);

        if (foundUser.salt && foundUser.hash && !foundUser.validPassword(user.password)) {
            return res.send({
                message: 'Password incorrect',
                error: []
            });
        }

        req.body = user;
        next();
    });
}

module.exports = {
    transformReqBody
}