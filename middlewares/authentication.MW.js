const jwt = require('jsonwebtoken');
const { getTotalQuantity } = require("../models/cart/cartcontent.M");
const { getCart } = require("../models/cart/cart.M");

class User {

    constructor(userID, userName, cartID, numOfProd) {
        this.userID = userID;
        this.userName = userName;
        this.cartID = cartID;
        this.numOfProd = numOfProd;
    }

    getNumofProd() {
        return this.numOfProd;
    }

    displayInfo() {
        console.log(this.userID, this.userName, this.cartID, this.numOfProd);
    }
}

class ListUsers {

    users = [];

    addUser(newUser) {
        this.users.push(newUser);
    }


    displayListUser() {

        for (let item of this.users) {
            item.displayInfo();
        }
    }


    isExist(newUserID) {
        for (let item of this.users) {

            if (String(item.userID) === String(newUserID)) {
                return true;
            }
        }

        return false;
    }

}

const sampleUser = new User(1, "Vinh", '1', 4);
let x = sampleUser.getNumofProd()

const listUsers = new ListUsers();
listUsers.addUser(sampleUser);
// listUsers.displayListUser();
// console.log(listUsers.isExist(sampleUser.userID));
// console.log("sample: ", x, sampleUser.userID)

const authenTokenResApi = (req, res, next) => {

    const access_token = req.cookies.jwt;

    if (typeof access_token == 'undefined') {
        res.status(401).send({ status: "no-access-token" });
    } else {
        next();
    }

}

const authenToken = (req, res, next) => {
    const access_token = req.cookies.jwt;
    // access_token có dạng  `Beaer [token]`
    if (typeof access_token == 'undefined') {
        // unauthorized
        res.redirect('/auth/login');
    } else {
        const token = access_token.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

            if (err) {
                res.status(401).send(
                    `<style>
                        h1{
                            text-align:center;
                        }
                        a{
                            display:block;
                            text-align:center;
                        }
                        button{
                        border:none;
                        border-radius:15px;
                        background-color:#176fd3;
                        padding: 1rem 2rem;
                        color:white;
                        font-size:1.8rem;
                        }
                    </style>
                    <h1> Phiên hết hạn. Hãy đăng nhập lại </h1>
                    <a href ="/dangnhap">
                    <button> Đăng nhập </button>
                    </a>`
                )
                res.locals.user = null;
            }
            res.locals.user = data;

        });

        next();
    };
}

const checkCurrentUser = (req, res, next) => {

    const access_token = req.cookies.jwt;

    if (!access_token) {
        next();
    } else {
        const token = access_token.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, data) => {

            // let quantity = await getQuantityByUserId(data.id);
            res.locals.user = data;

            // console.log(data.id);
            const cart_id = await getCart(data.id);

            let totalQuantity = await getTotalQuantity(cart_id);

            // lấy số lượng của cart
            let quantity = 0;
            if (totalQuantity[0].sum != null) {
                quantity = totalQuantity[0].sum;
            }


            if (typeof(req.listUsers) == 'undefined') {
                req.listUsers = Object(listUsers);
            }

            const curUser = new User(res.locals.user.id, res.locals.user.name, '1', quantity);
            if (req.listUsers.isExist(curUser.userID) === false) {
                req.listUsers.addUser(curUser);
            };

            res.locals.user.quantity = quantity;
        });


        next();

    }
}

const checkUserIsLogin = (req, res, next) => {

    const access_token = req.cookies.jwt;
    if (!access_token) {
        next();
    } else if (access_token) {
        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        //     if (err) {
        //         res.clearCookie("jwt");
        //     }

        // });

        res.redirect('/');
    }
};



module.exports = { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin, User, ListUsers, listUsers }