const db = require('../db');
const carts = "public.carts";


exports.addNewCarts = async(accountID) => {
    const data = await db.query(`
    INSERT INTO ${carts}
    ("account_id")
    VALUES ('${accountID}')
    RETURNING *`);

    return data.rows;
}

exports.getCart = async(accountID) => {

    const { rows } = await db.query(`
    SELECT cart_id 
    FROM  ${carts}
    WHERE "account_id" = '${accountID}'
    `);

    return rows[0].cart_id;
}