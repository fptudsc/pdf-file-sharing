const express = require('express');

const router = express.Router();

router.use('/sources', require('./routes/source.route'));

router.use('/users', require('./routes/user.route'))

module.exports = router;