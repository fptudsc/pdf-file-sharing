const mongoose = require('mongoose');
const User = mongoose.model('User');
const Source = mongoose.model('Source');

const index = (req, res) => {
    res.render('admin/index');
};

const getAllUsers = (req, res) => {
    User.find({})
        .exec((err, users) => {
            if (err) return next(err);
    
            res.render('admin/users', { users });
        });
};

const getUser = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return next(err);

        res.render('admin/user-detail', { user, method: 'PUT' });
    })
}

const updateUser = (req, res) => {
    const errors = req.flash('errors-validate')[0];

    if (errors)
        return res.send({ errors });

    const { firstName, lastName, username, password, email }  = req.body;

    User.findById(req.params.id, (err, user) => {
        if (err) return next(err);

        user.firstName = firstName;
        user.lastName = lastName;
        user.username = username;
        user.emai = email;

        user.setPassword(password);
    
        user.save(err => {
            if (err) return next(err);
    
            res.redirect(
                303,    // avoid PUT redirect to PUT
                `/admin/users/${user.id}`
            );
        });
    });
}

const getAllSources = (req, res) => {
    Source.find({})
        .populate({ path: 'author', select: 'username' })
        .exec((err, sources) => {
            if (err) return next(err);

            res.render('admin/sources', { sources });
        });
};

const getSource = (req, res) => {
    Source.find(req.params.id, (err, source) => {
        if (err) return next(err);

        res.render('admin/source-detail');
    });
}

module.exports = {
    index,
    getAllUsers,
    getUser,
    updateUser,
    getAllSources,
    getSource
}