// Contain main routes
const express = require("express");
const router = express.Router();

const siteRoute = require("./site");
const cartRoute = require("./cart");
const orderRoute = require("./order");
const authRoute = require("./auth");
const paymentRoute = require("./payment");
const accountRoute = require("./account");
const subjectRoute = require("./subject");

const { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin } = require("../middlewares/authentication.MW");


router.use("*", checkCurrentUser);
// /homepage
router.use("/", siteRoute);

// /shopping-cart
router.use("/shopping-cart", cartRoute);
router.use("/list-order", orderRoute);
router.use("/auth", authRoute);
router.use("/payment", paymentRoute);
router.use("/subject", subjectRoute);
router.use("/account", accountRoute);

module.exports = router;