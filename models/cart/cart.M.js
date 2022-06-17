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