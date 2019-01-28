const Source = require('mongoose').model('Source');

const findMyOwnSource = (req, res, next) => {
    Source.findSourcesByUserId(req.user.id, (err, sources) => {
        if (err) return next(err);
        res.send(JSON.stringify(sources));
    });
};

module.exports = {
    findMyOwnSource
}