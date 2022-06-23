const express = require('express');
const router = express.Router();
const { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin } = require("../middlewares/authentication.MW");

router.use('/logup', require('../controllers/auth/logup.C'));
router.use('/login', require('../controllers/auth/login.C'));
router.use('/logout', require('../controllers/auth/logout.C'));

module.exports = router;