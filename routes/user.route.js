const express = require('express');
const router = express.Router();
const csurf = require('csurf');

const csrfProtection = csurf();

const controller = require('../controllers/user.controller');

router.get('/', controller.viewProfile);

router.get('/viewOwnSources', controller.viewOwnSources);

router.get('/viewProfile', csrfProtection, controller.viewProfile);

router.get('/changePassword', csrfProtection, controller.changePassword);

router.post('/changePassword', csrfProtection, controller.postChangePassword);

module.exports = router;