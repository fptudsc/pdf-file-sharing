const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

const profileMiddleware = require('../middlewares/profile.middleware');

router.post(
    '/saveProfile',
    profileMiddleware.transformReqBody,
    controller.saveProfile
);

module.exports = router;