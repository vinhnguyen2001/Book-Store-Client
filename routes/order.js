// Contain order routes

const express = require('express');
const router = express.Router();
const { OrderControllers } = require("../controllers/order/order.C");


const orderCtls = new OrderControllers;
router.get("/", orderCtls.loadListOrder);
router.get("/:id/detail", orderCtls.loadDetailOrder)

module.exports = router;