const express = require("express");
const router = express.Router();

const { getProdbyIDSubject } = require("../../models/product/products.M");
const { getFiveProducts, showingPrice, getDetailInforProduct, getProductsByName } = require("../../models/product/products.M")


class SubjectControllers {


    // [GET] /subject/<subject-type>

    async loadAllProductInSubjectType(req, res) {

        const { id, subject } = req.params;
        const { page, lowerPrice, upperPrice, filter } = req.query;

        // console.log("page: ", page);
        let strQueryFilter = "";
        let strQueryPrice = "";
        if (filter) {
            strQueryFilter = `ORDER BY ${filter}`;
            strQueryPrice = `AND PD.price BETWEEN ${lowerPrice} AND ${upperPrice}`;
        }


        const { total_page, packs } = await getProdbyIDSubject({
            IDsubject: id,
            filter: strQueryFilter,
            price: strQueryPrice,
            page: page,
        })

        if (packs.length > 0) {
            for (let elm of packs) {
                elm.price = showingPrice(elm.price);
            }
        }
        res.render("subject/subject", {

            title: `Subject - ${subject} | Blue Book Store `,
            cssCs: () => "subject/css",
            scriptCs: () => "subject/script",
            id_subject: id,
            name_subject: subject,
            packs,
            total_page,
            lowerPrice,
            upperPrice,
            filter,

        });
    };

    //[POST]
    async loadAllProductInSubjectTypePost(req, res) {

        const { id, subject, page } = req.params;
        const { search, lowerPrice, upperPrice, filter } = req.body;
        let strQueryFilter = "";
        let strQueryPrice = "";
        if (filter) {
            strQueryFilter = `ORDER BY ${filter}`;
            strQueryPrice = `AND PD.price BETWEEN ${lowerPrice} AND ${upperPrice}`;
        }

        const { total_page, packs } = await getProdbyIDSubject({
            IDsubject: id,
            filter: strQueryFilter,
            price: strQueryPrice,

        })


        if (packs.length > 0) {
            for (let elm of packs) {
                elm.price = showingPrice(elm.price);
            }
        }

        res.status(200).json({ data: packs, total_page, id_subject: id, name_subject: subject });
    }
}


module.exports = { SubjectControllers };