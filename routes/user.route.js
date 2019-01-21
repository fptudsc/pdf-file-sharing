const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

router.get('/', controller.viewProfile);

router.get('/register', controller.createAccount);

router.post('/register', controller.register);

module.exports = router;