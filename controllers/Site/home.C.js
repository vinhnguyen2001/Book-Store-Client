const express = require("express");
const router = express.Router();

const { getFiveProducts, showingPrice, getDetailInforProduct, getProductsByName } = require("../../models/product/products.M")

const { ListUsers, User, listUsers, checkCurrentUser } = require("../../middlewares/authentication.MW")

const { getAllCommentByProdID } = require("../../models/comment/comment.M");
// GET /
router.get("/", async(req, res) => {
    res.redirect("/homepage");
})


// GET /homepage
router.get("/homepage", async(req, res) => {


    try {

        const firstPacks = await getFiveProducts(1, 2, 3, 4, 5);
        // console.log(res.locals.user)
        req.currentUser = Object.assign(1);

        // const curUser = new User(res.locals.user.id, res.locals.user.name, '1', 4);

        // console.log('trangg chủ', req.listUsers)

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
        const { id } = req.params;

        const cmtData = await getAllCommentByProdID(id);
        // console.log("cmtData: ", cmtData);
        const productData = await getDetailInforProduct(id);
        // console.log('trang detail', req.listUsers)

        // console.log(productData)

        productData[0].price = showingPrice(productData[0].price);

        res.render("DetailBook/DetailBook", {
            title: `${productData[0].product_name} - Detail Book | Blue Book Store `,
            cssCs: () => "detail/css",
            scriptCs: () => "detail/script",
            pack: productData[0],
            cmtPacks: cmtData,

        });

    } catch (err) {
        throw Error(err);
    }
});


// GET /search
router.get('/search', async(req, res) => {

    try {
        let searchValue = req.query.search;
        const data = await getProductsByName({ search: searchValue });
        let flag = 1;

        if (data.length == 0) {
            flag = 0;
        }

        for (elm of data) {
            elm.price = showingPrice(elm.price);
        }
        res.render("search/search", {
            title: "Search | Blue Book Store ",
            cssCs: () => "search/css",
            scriptCs: () => "search/script",
            search_key: searchValue,
            packs: data,
            flag,
        });

    } catch (err) {
        console.log(err)
        throw Error(err);
    }
});


// POST /search

router.post('/search', async(req, res) => {

    try {
        console.log("body:", req.body)

        const { search, lowerPrice, upperPrice, filter } = req.body;
        let strQueryFilter = `ORDER BY ${filter}`;
        let strQueryPrice = `AND PD.price BETWEEN ${lowerPrice} AND ${upperPrice}`;

        const data = await getProductsByName({ search: search, price: strQueryPrice, filter: strQueryFilter });

        if (data.length > 0) {
            for (elm of data) {
                elm.price = showingPrice(elm.price);
            }
        }
        res.status(200).json({ data });


    } catch (err) {
        console.log(err)
        throw Error(err);
    }
});


module.exports = router;