const express = require("express");
const router = express.Router();

const { getFiveProducts, showingPrice } = require("../../models/product/products.M")

// GET /homepage
router.get("/homepage", async(req, res) => {

    try {

        const firstPacks = await getFiveProducts(1, 2, 3, 4, 5);

        // console.log("firstPack :", firstPacks);
        for (item of firstPacks) {

            item.price = showingPrice(item.price);
        }

        res.render("home", {

            title: "Home page | Blue Book Store ",
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



// GET /book/:id/detail

router.get('/book/:id/detail', async(req, res) => {

    try {
        let bookID = req.params.id;


        res.render("DetailBook/DetailBook", {
            title: "Home page | Blue Book Store ",
            cssCs: () => "detail/css",
            scriptCs: () => "home/script",
        });

    } catch (err) {
        throw Error(err);
    }
});

module.exports = router;