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
            scriptCs: () => "detail/script",
        });

    } catch (err) {
        throw Error(err);
    }
});


// GET /search
router.get('/search', async(req, res) => {

    try {
        let bookID = req.params.id;


        res.render("search/search", {
            title: "Search | Blue Book Store ",
            cssCs: () => "search/css",
            scriptCs: () => "search/script",
        });

    } catch (err) {
        throw Error(err);
    }
});

module.exports = router;