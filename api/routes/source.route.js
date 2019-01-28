const express = require('express');

const router = express.Router();

const controller = require('../controllers/source.controller');

router.get('/myOwnSources', controller.findMyOwnSource);

module.exports = router;