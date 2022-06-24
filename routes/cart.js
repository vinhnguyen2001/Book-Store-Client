// Contain cart routes
const express = require('express');
const router = express.Router();
const { CartControllers } = require("../controllers/cart/cart.C");
const { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin } = require("../middlewares/authentication.MW");

const cartCtls = new CartControllers;
router.get("/", cartCtls.loadCartShopping);
router.post("/", cartCtls.updateItemInCart);
router.post("/add-item", cartCtls.addItemInCart);
router.delete("/:id/delete", cartCtls.deleteItemInCart);


module.exports = router;