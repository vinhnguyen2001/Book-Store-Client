const express = require("express");
const router = express.Router();

const { getAccountById, updateAccountByIDAccount, phoneIsExist } = require("../../models/account/account.M")

class accountControllers {


    //[GET]
    async loadInfoAccount(req, res) {

        const { update } = req.query;
        try {
            if (!res.locals.user) {
                return res.redirect("/auth/login");
            }
            const accountID = res.locals.user.id;

            const data = await getAccountById(accountID);
            // console.log(account);


            res.render("account/account", {

                title: "Update Information  | Blue Book Store ",
                cssCs: () => "account/css",
                scriptCs: () => "account/script",
                account: data[0],
                update,

            });
        } catch (err) {
            console.error(err);
            throw Error(err);
        }
    }

    //[POST]
    async updateInfoAccount(req, res) {

        try {

            const { firstname, lastname, phone, address, district, ward, province } = req.body;
            // console.log("req.body", req.body);
            if (!res.locals.user) {
                return res.redirect("/auth/login");
            }

            if (firstname == "" || lastname == "" || phone == "" || address == "" || district == "Rỗng" || ward == "Rỗng" || province == "Rỗng") {
                return res.redirect("/account/update?update=001");
            }

            const isExist = await phoneIsExist(phone);
            const accountID = res.locals.user.id;

            if (isExist.length > 0 && isExist[0].account_id != accountID) {
                return res.redirect("/account/update?update=002");
            }


            const data = await updateAccountByIDAccount(accountID, firstname, lastname, phone, address, ward, district, province);


            res.render("account/account", {

                title: "Update Information  | Blue Book Store ",
                cssCs: () => "account/css",
                scriptCs: () => "account/script",
                account: data[0],
                status: "success",

            });
        } catch (err) {
            console.error(err);
            throw Error(err);
        }

    }

}



module.exports = { accountControllers };