const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

router.get('/', controller.viewProfile);

router.get('/viewOwnSources', controller.viewOwnSources);

module.exports = router;