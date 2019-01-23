const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');

router.get('/login', controller.indexLogin);

router.post('/login', controller.login);

router.get('/logout', controller.logout);

module.exports = router;