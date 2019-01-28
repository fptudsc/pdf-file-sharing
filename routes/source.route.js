const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const controller = require('../controllers/source.controller');

// auth middleware to require auth and role
const auth = require('../middlewares/auth.middleware');
const validator = require('../validators/source.validate');

router.get('/', controller.index);

// this route require authentication and has one of the role of list [ 'uploader', 'admin' ]
router.get(
    '/upSource',
    auth.requireAuth,
    auth.requireRole([ 'uploader', 'admin' ]),
    controller.upSource
);

router.post(
    '/upSource',
    auth.requireAuth,
    auth.requireRole([ 'uploader', 'admin' ]),
    multipartMiddleware,
    validator.validate,
    controller.postUpSource
);

router.post('/upSource', controller.postUpSource);

module.exports = router;