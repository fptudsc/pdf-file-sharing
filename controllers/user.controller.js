const User = require('mongoose').model('User');

const viewProfile = async (req, res) => {

};

const viewOwnSources = (req, res) => {
    res.render('sources/index');
};

module.exports = {
    viewProfile,
    viewOwnSources
};