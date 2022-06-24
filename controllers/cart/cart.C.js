const express = require("express");
const router = express.Router();

const { updateItemsInCartContent, deleteItemByNameInCartContent, addNewItemsInCartContent, checkItemExistInCartContent, getCartContentByIdCart, updateCartContent } = require("../../models/cart/cartcontent.M")
const { getCart } = require("../../models/cart/cart.M");
const { checkValidation, getFiveProducts, showingPrice, getDetailInforProduct, getProductsByName } = require("../../models/product/products.M")


class CartControllers {

    //[GET] /shopping-cart/
    async loadCartShopping(req, res) {
        try {

            if (!res.locals.user) {
                return res.redirect("/auth/login");
            };

            const account_id = res.locals.user.id;
            let totalPrice = 0;

            const cart_id = await getCart(account_id);;
            const data = await getCartContentByIdCart(cart_id);

            // console.log(data);

            for (let item of data) {
                item["prevprice"] = item.price;
                item.price = parseInt(item.price) * item.cart_quantity;
                totalPrice += parseInt(item.price);
                item.price = showingPrice(item.price);


            }

            totalPrice = showingPrice(totalPrice);

            res.render("shoppingCart/shoppingcart", {
                title: "Shopping Cart | Blue Book Store ",
                cssCs: () => "cart/css",
                scriptCs: () => "cart/script",
                packs: data,
                sumPrice: totalPrice,
            });

        } catch (err) {
            throw Error(err);
        }
    }

    // [POST] /shopping-cart
    async updateItemInCart(req, res) {
        try {

            const { id, quantity } = req.body;

            var strQuery = ``;
            for (let i = 0; i < id.length; i++) {

                let fistValue = quantity[i];
                let secondValue = id[i];
                strQuery += `
                    UPDATE public.cart_content
                    SET cart_quantity= ${fistValue}
                    WHERE cart_content_id=${secondValue};
                `;
            }

            await updateCartContent(`${strQuery}`);

            res.status(200).send({ status: "success" });

        } catch (err) {
            console.error(err);
            throw Error(err);
        }
    }

    // [POST] /shopping-cart/add-item
    async addItemInCart(req, res) {
        try {
            // let bookID = req.params.id;

            const { id } = req.body;

            if (!res.locals.user) {
                res.status(400).send({ status: "no-access-token" });
                return;
            }

            const account_id = res.locals.user.id;
            const isValidation = await checkValidation(id);

            if (isValidation[0].stock == 0) {
                return res.status(403).send({ status: "outofproduct" });

            }


            const cart_id = await getCart(account_id);
            const existData = await checkItemExistInCartContent(cart_id, id);

            if (existData.length != 0) {
                const new_quantity = parseInt(existData[0].cart_quantity) + 1;
                const newdata = await updateItemsInCartContent(cart_id, id, new_quantity)

            } else {
                const data = await addNewItemsInCartContent(cart_id, id, 1);
            }

            res.status(200).send({ status: "success" });


        } catch (err) {
            throw Error(err);
        }
    }

    //[DEL] /shopping-cart/:id/delete
    async deleteItemInCart(req, res) {
        try {

            const cartContentId = req.params.id;
            const deletedData = await deleteItemByNameInCartContent(cartContentId);

            return res.redirect('back');

        } catch (err) {
            throw Error(err);
        }
    }
}

module.exports = router;

module.exports = {
    CartControllers,
}