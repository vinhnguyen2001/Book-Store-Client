const express = require("express");
const router = express.Router();


// GET /shopping-cart

router.get('/', async(req, res) => {

    try {
        let bookID = req.params.id;


        res.render("shoppingCart/shoppingcart", {
            title: "Shopping Cart | Blue Book Store ",
            cssCs: () => "cart/css",
            scriptCs: () => "cart/script",
        });

    } catch (err) {
        throw Error(err);
    }
});

module.exports = router;