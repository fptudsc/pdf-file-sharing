const User = require('mongoose').model('User');

const saveProfile = (req, res, next) => {
    const { firstName, lastName, email, username } = req.body;

    User.findById(req.user.id, (err, user) => {
        if (err) return next(err);

        // updating user's profile
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.username = username;

        // saving profile
        user.save((err, savedUser) => {
            if (err) return next(err);
            res.status(200).send({
                message: 'Saved Profile',
                status: 200,
                errors: []
            });
        });
    });
}

module.exports = {
    saveProfile
}