const express = require('express');

const router = express.Router();



router.use('/', require('../controllers/site/home.C'));
router.use('/search', require('../controllers/site/home.C'));



module.exports = router;