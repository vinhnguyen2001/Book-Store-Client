const db = require('../db');
const orders = "public.orders";

exports.addNewOrder = async(account_id, order_total, order_phone, order_a, order_w, order_d, order_p, order_status) => {


    const { rows } = await db.query(`
    INSERT INTO ${orders}("account_id","order_total","order_time", "order_phone", "order_a", "order_w", "order_d", "order_p", "order_status")
    VALUES ('${account_id}', '${order_total}',NOW()::timestamp, '${order_phone}', '${order_a}', '${order_w}', '${order_d}', '${order_p}', '${order_status}')
    RETURNING*
    `);

    return rows;
}

exports.getOrders = async(account_id) => {

    const { rows } = await db.query(
        `
        SELECT *
        FROM ${orders}
        WHERE account_id = ${account_id}
        ORDER BY order_id DESC `
    )
    return rows;
}