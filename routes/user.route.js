const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

router.get('/', controller.viewProfile);

router.get('/viewOwnSources', controller.viewOwnSources);

router.get('/viewProfile', controller.viewProfile);

router.get('/changePassword', controller.changePassword);

router.post('/changePassword', controller.postChangePassword);

module.exports = router;