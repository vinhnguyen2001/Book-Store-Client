const { application } = require("express");
const express = require("express");
const router = express.Router();

const { updateItemsInCartContent, deleteItemsInCartContent, addNewItemsInCartContent, checkItemExistInCartContent, getCartContentByIdCart, deleteItemByNameInCartContent } = require("../../models/cart/cartcontent.M")
const { getCart } = require("../../models/cart/cart.M");
const { getFiveProducts, showingPrice, getDetailInforProduct, getProductsByName } = require("../../models/product/products.M");
const { getAccountById } = require("../../models/account/account.M");
const { addNewOrder } = require("../../models/order/order.M");
const { addNewOrderContent } = require("../../models/order/ordercontent.M");
const { updateStockInProduct, getProductById } = require("../../models/product/products.M")




class PaymentControllers {


    // [GET] payment/information-order
    async loadInfoPayment(req, res) {
        try {
            const { error } = req.query;
            if (!res.locals.user) {
                return res.redirect("/auth/login");
            }
            const account_id = res.locals.user.id;
            let totalPrice = 0;
            const user = await getAccountById(account_id);

            const cart_id = await getCart(account_id);
            const data = await getCartContentByIdCart(cart_id);

            if (data.length == 0) {
                return res.redirect("/homepage");
            }

            for (let item of data) {
                item["prevprice"] = item.price;
                item.price = parseInt(item.price) * item.cart_quantity;
                totalPrice += parseInt(item.price);
                item.price = showingPrice(item.price);
            }
            totalPrice = showingPrice(totalPrice);


            res.render("payment/payment", {
                title: "Order's Information | Blue Book Store ",
                cssCs: () => "payment/css",
                scriptCs: () => "payment/script",
                sumPrice: totalPrice,
                packs: data,
                error,
                account: user[0],
            });

        } catch (error) {
            console.error(error);
            throw Error(error);

        }
    }

    // [POST] payment/information-order
    async excPayment(req, res) {
        try {
            let { lastname, firstname, email, phone, address, province, district, ward, total } = req.body;
            var strQuery = ``;

            if (lastname == "" || firstname == "") {
                return res.redirect('/payment/information-order?error=003');
            }
            if (phone === "" || phone[0] != '0' || phone.length != 10) {
                return res.redirect('/payment/information-order?error=002');
            }
            if (province === 'Rỗng' || address.length == 0) {
                return res.redirect('/payment/information-order?error=001');
            }
            // loai bo dau phẩy
            total = total.replace(/,/g, "");

            const account_id = res.locals.user.id;
            const cart_id = await getCart(account_id);
            const itemsInCart = await getCartContentByIdCart(cart_id);

            const newOrder = await addNewOrder(account_id, total, phone, address, ward, district, province, 0);
            // lap cau truy van
            for (let item of itemsInCart) {
                strQuery += `(${newOrder[0].order_id},${item.product_id},${item.price},${item.cart_quantity}),`;
                let productData = await getProductById(item.product_id);

                let remainedOfStock = parseInt(productData[0].stock) - parseInt(item.cart_quantity);
                updateStockInProduct(item.product_id, remainedOfStock);

            }
            strQuery = strQuery.slice(0, strQuery.length - 1);
            const newRowcontent = await addNewOrderContent(strQuery);

            const deteledCart = await deleteItemsInCartContent(cart_id);
            return res.redirect('/homepage?success=ordersuccess');

        } catch (err) {
            console.error(err);
            throw Error(err);
        }
    }
}


module.exports = router;

module.exports = {
    PaymentControllers
}