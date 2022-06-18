const express = require("express");
const router = express.Router();

//[GET] /logout
router.get('/', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/auth/login');
});

module.exports = router;