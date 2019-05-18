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

const getAllSources = (req, res) => {
    Source.find({})
        .populate({ path: 'author', select: 'username' })
        .exec((err, sources) => {
            if (err) return next(err);

            res.render('admin/sources', { sources });
        });
};

module.exports = {
    index,
    getAllUsers,
    getAllSources
}