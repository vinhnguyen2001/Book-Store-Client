const express = require("express");
const router = express.Router();

const { getFiveProducts, showingPrice } = require("../../models/product/products.M")

// GET /homepage
router.get("/homepage", async(req, res) => {

    try {

        const firstPacks = await getFiveProducts(1, 2, 3, 4, 5);

        for (item of firstPacks) {

            item.price = showingPrice(item.price);
        }

        res.render("home", {

            title: "Home page | My Book Store ",
            cssCs: () => "home/css",
            scriptCs: () => "home/script",
            firstPacks,
            secondPacks: firstPacks,
            thirdPacks: firstPacks,

        });



    } catch (err) {
        throw Error(err);
    }
});

module.exports = router;