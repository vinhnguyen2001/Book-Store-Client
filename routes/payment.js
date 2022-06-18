const express = require('express');
const router = express.Router();

router.use("/information-order", require("../controllers/payment/payment.C"));

module.exports = router;