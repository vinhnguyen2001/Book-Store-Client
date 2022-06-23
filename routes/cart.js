// Contain main routes

const express = require('express');

const router = express.Router();
const { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin } = require("../middlewares/authentication.MW");


router.use('/', require('../controllers/cart/cart.C'));


module.exports = router;