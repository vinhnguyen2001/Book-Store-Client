const express = require("express");
const router = express.Router();

const { getFiveProducts, showingPrice, getDetailInforProduct, getProductsByName } = require("../../models/product/products.M")

const { ListUsers, User, listUsers, checkCurrentUser } = require("../../middlewares/authentication.MW")

const { getAllCommentByProdID } = require("../../models/comment/comment.M");


class HomeControllers {

    // [GET] /
    redirectFunction(req, res) {
        return res.redirect("/homepage");
    }

    // [GET] /homepage
    async loadHomepage(req, res) {
        try {
            const { success } = req.query;
            const firstPacks = await getFiveProducts(1, 2, 3, 4, 5);
            req.currentUser = Object.assign(1);

            // console.log('trangg chủ', req.listUsers)
            for (let item of firstPacks) {

                item.price = showingPrice(item.price);
            }

            res.render("home", {

                title: "Home page | Blue Book Store ",
                cssCs: () => "home/css",
                scriptCs: () => "home/script",
                firstPacks,
                secondPacks: firstPacks,
                thirdPacks: firstPacks,
                success,
            });



        } catch (err) {
            throw Error(err);
        }
    }

    // [GET] /book/:id/detail
    async loadBookDetail(req, res) {
        try {
            const { id } = req.params;

            const cmtData = await getAllCommentByProdID(id);
            const productData = await getDetailInforProduct(id);

            let imgList = [];
            for (let elm of productData) {
                imgList.push(elm.image_link)
            }

            // console.log(productData)

            productData[0].price = showingPrice(productData[0].price);

            res.render("DetailBook/DetailBook", {
                title: `${productData[0].product_name} - Detail Book | Blue Book Store `,
                cssCs: () => "detail/css",
                scriptCs: () => "detail/script",
                pack: productData[0],
                cmtPacks: cmtData,
                img: imgList,

            });

        } catch (err) {
            throw Error(err);
        }
    }

    // [GET] /search
    async loadSearchGet(req, res) {
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
    }

    // [POST] /search
    async loadSearchPost(req, res) {
        try {

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
    }
}

module.exports = router;

module.exports = { HomeControllers };