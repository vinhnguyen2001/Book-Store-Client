// Contain main routes

const express = require("express");
const siteRoute = require("./site");
const cartRoute = require("./cart");

const router = express.Router();


// /homepage
router.use("/", siteRoute);

// /shopping-cart
router.use("/shopping-cart", cartRoute);



module.exports = router;