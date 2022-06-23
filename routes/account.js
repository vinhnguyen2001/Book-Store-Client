const express = require('express');
const router = express.Router();

const { accountControllers } = require("../controllers/account/account.C");

const accCtls = new accountControllers;

router.get("/update", accCtls.loadInfoAccount);
router.post("/update", accCtls.updateInfoAccount);
module.exports = router;