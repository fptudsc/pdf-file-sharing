const express = require('express');
const router = express.Router();
const csurf = require('csurf');

const csrfProtection = csurf();

const controller = require('../controllers/user.controller');

const profileMiddleware = require('../middlewares/profile.middleware');

router.post(
    '/saveProfile',
    csrfProtection,
    profileMiddleware.transformReqBody,
    controller.saveProfile
);

module.exports = router;