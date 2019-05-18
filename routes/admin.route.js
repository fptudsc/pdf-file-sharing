const express = require('express');
const router = express.Router();

const controller = require('../controllers/admin.controller.js');

router.get('/', controller.index);

router.get('/users', controller.getAllUsers);

router.get('/sources', controller.getAllSources);

module.exports = router;