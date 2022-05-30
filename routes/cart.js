// Contain main routes

const express = require('express');

const router = express.Router();



router.use('/', require('../controllers/cart/cart.C'));


module.exports = router;