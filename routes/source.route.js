const express = require('express');
const router = express.Router();

const controller = require('../controllers/source.controller');

// auth middleware to require auth and role
const auth = require('../middlewares/auth.middleware');

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
    controller.postUpSource
);

router.post('/upSource', controller.postUpSource);

module.exports = router;