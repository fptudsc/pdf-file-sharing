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

        res.render('admin/user-detail', { user });
    })
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
    getAllSources,
    getSource
}