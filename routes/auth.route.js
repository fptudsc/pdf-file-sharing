const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const validator = require('../validators/user.validate');

router.get('/register', controller.register);

router.post('/register', validator.validate, controller.postRegister);

router.get('/login', controller.indexLogin);

router.post('/login', controller.login);

router.get('/logout', controller.logout);

router.get('/facebook', controller.loginFacebook);

router.get('/facebook/callback', controller.callbackFacebook);

module.exports = router;