const Source = require('mongoose').model('Source');

const findMyOwnSource = (req, res, next) => {
    Source.findSourcesByUserId(req.user.id, (err, sources) => {
        if (err) return next(err);
        const results = [];
        for (let i = 0; i < sources.length; i++) {
            results.push({
                title: sources[i].title,
                description: sources[i].description,
                url: sources[i].file_data.secure_url,
                file_name: sources[i].file_name
            });
        }
        res.send(JSON.stringify(results));
    });
};

module.exports = {
    findMyOwnSource
}