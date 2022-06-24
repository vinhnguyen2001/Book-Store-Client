const express = require("express");
const router = express.Router();

const { getOrders } = require("../../models/order/order.M");
const { convertDate } = require("../../middlewares/dateTime.Mw");
const { getFiveProducts, showingPrice, getDetailInforProduct, getProductsByName } = require("../../models/product/products.M")
const { getOrderContentByIdOrder } = require("../../models/order/ordercontent.M");


class OrderControllers {


    //[GET] /list-orders
    async loadListOrder(req, res) {
        try {

            if (!res.locals.user) {
                return res.redirect("/auth/login");
            };
            const account_id = res.locals.user.id;
            let totalPrice = 0;

            const data = await getOrders(account_id);


            for (let item of data) {

                item.order_total = showingPrice(item.order_total);

                item.order_time = convertDate(item.order_time);

                console.log("item:", item.order_status);
                if (item.order_status == 0) {
                    item.order_status = "Chưa xác nhận";
                } else if (item.order_status == 1) {
                    item.order_status = "Đã xác nhận";
                } else if (item.order_status == 2) {
                    item.order_status = "Đã đang giao";
                } else if (item.order_status == 3) {
                    item.order_status = "Đã giao";
                } else {
                    item.order_status = "Đã hủy"
                }
            }


            res.render("order/order", {
                title: "Your's orders | Blue Book Store ",
                cssCs: () => "order/css",
                scriptCs: () => "cart/script",
                packs: data,
                sumPrice: totalPrice,
            });

        } catch (err) {
            throw Error(err);
        }
    }

    //[GET] /list-orders/:id/detail
    async loadDetailOrder(req, res) {
        try {

            if (!res.locals.user) {
                return res.redirect("/auth/login");
            };
            const account_id = res.locals.user.id;
            let totalPrice = 0;

            const order_id = req.params.id;
            const data = await getOrderContentByIdOrder(order_id);


            for (let item of data) {
                item["prevprice"] = item.price;
                item.price = parseInt(item.price) * item.order_quantity;
                totalPrice += parseInt(item.price);
                item.price = showingPrice(item.price);
            }

            totalPrice = showingPrice(totalPrice);

            res.render("order/orderdetail", {
                title: `Detail of Order #${order_id} | Blue Book Store `,
                cssCs: () => "order/orderdetail",
                scriptCs: () => "cart/script",
                packs: data,
                sumPrice: totalPrice,
                order_id: order_id,
            });

        } catch (err) {
            throw Error
        }
    }
}

module.exports = router;
module.exports = { OrderControllers };