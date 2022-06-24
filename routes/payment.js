const express = require('express');
const router = express.Router();

const { PaymentControllers } = require("../controllers/payment/payment.C");

const paymentCtls = new PaymentControllers;
router.get("/information-order", paymentCtls.loadInfoPayment);
router.post("/information-order", paymentCtls.excPayment);

module.exports = router;