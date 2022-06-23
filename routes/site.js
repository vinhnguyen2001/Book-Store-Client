const express = require('express');
const router = express.Router();
const { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin } = require("../middlewares/authentication.MW");

router.use('/', checkCurrentUser, require('../controllers/site/home.C'));
router.use('/search', require('../controllers/site/home.C'));


module.exports = router;