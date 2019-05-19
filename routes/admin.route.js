const express = require('express');
const router = express.Router();

const controller = require('../controllers/admin.controller.js');
const userValidator = require('../validators/user.validate');

router.get('/', controller.index);

router.get('/users', controller.getAllUsers);

router.get('/users/:id', controller.getUser);

router.put('/users/:id', 
    userValidator.validateWithoutRedirect,
    controller.updateUser
);

router.get('/sources', controller.getAllSources);

router.get('/sources/:id', controller.getSource);

module.exports = router;