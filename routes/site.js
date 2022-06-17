const express = require('express');

const router = express.Router();



router.use('/', require('../controllers/site/home.C'));
router.use('/search', require('../controllers/site/home.C'));
router.use('/auth/logup', require('../controllers/auth/logup.C'));
router.use('/auth/login', require('../controllers/auth/login.C'));



module.exports = router;