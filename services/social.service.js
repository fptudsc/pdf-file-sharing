const User = require('mongoose').model('User')

const registerSocial = (data, provider, accessToken, callback) => {
    User.findOne({ 'email': data.email }, (err, existing_user) => {
        if (err) return callback(err);

        if (existing_user)
            return callback(null, existing_user);
        
        const lastName = data.last_name || '';
        const firstName = [data.middle_name, data.first_name].filter(Boolean).join(' ');

        let newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: data.email,
            profile_picture: data.profile_picture,
            social: {
                [provider]: {
                    id: data.id,
                    accessToken: accessToken
                }
            }
        });
        
        newUser.save((err, user) => {
            if (err) return callback(err);
            callback(null, user);
        });
    });
};

module.exports = {
    registerSocial
}