const db = require('../db');
const order_content = "public.order_content";

exports.addNewOrderContent = async(strQuery) => {
    // console.log(strQuery)
    const { rows } = await db.query(`
    INSERT INTO ${order_content}(order_id, product_id, order_price, order_quantity)
    VALUES ${strQuery}
    RETURNING*`);
    return rows;
}

exports.getOrderContentByIdOrder = async(order_id) => {

    const { rows } = await db.query(`
    SELECT *
    FROM ${order_content} ORC JOIN  public.products PD ON ORC.product_id = PD.product_id 
    JOIN public.images IMG ON PD.product_id = IMG.product_id AND IMG.image_id = 1
    WHERE order_id = ${order_id}
    `);

    return rows;
}