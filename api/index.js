const express = require('express');

const router = express.Router();

router.use('/sources', require('./routes/source.route'));

module.exports = router;