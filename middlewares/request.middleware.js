const debug = require('debug')('request');
const cloudinary = require('cloudinary');

const wirePreRequest = (req, res, next) => {
    debug(req.method + ' ' + req.url);
    if (typeof(process.env.CLOUDINARY_URL)=='undefined'){
        throw new Error('Missing CLOUDINARY_URL environment variable')
    }else{
        // Expose cloudinary package to view
        res.locals.cloudinary = cloudinary;
        next();
    }
};

const wirePostRequest = (err, req, res, next) => {
    if (!err) return next();
    
    if (err === 'Must supply api_key') {
        res.status(500).render('errors/dotenv');
    } else {
        debug('ERROR :{} 500 ' + err.message);
        debug(err.stack);
        res.status(500).render('errors/500', { error: err});
    }
}

const notFoundMiddleware = (req, res, next) => {
    debug('ERROR :{} 404');
    res.status(404).render('errors/404', {
        err: 'Not found',
        url: req.url
    });
}

module.exports = {
    wirePostRequest,
    wirePreRequest,
    notFoundMiddleware
}