const express = require('express');
const router = express.Router();
router.use("/", require("../controllers/Site/oop.C"));

module.exports = router;