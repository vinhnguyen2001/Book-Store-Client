// Contain main routes

const express = require("express");
const siteRoute = require("./site");

const router = express.Router();


router.use("/", siteRoute);
module.exports = router;