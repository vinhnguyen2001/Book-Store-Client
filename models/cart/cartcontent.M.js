const db = require('../db');
const cart_content = " public.cart_content";


exports.checkItemExistInCartContent = async(cart_id, product_id) => {

    const { rows } = await db.query(`
    SELECT * 
    FROM ${cart_content}
    WHERE "cart_id" = '${cart_id}' AND "product_id" = '${product_id}'
    `)

    return rows;
}
exports.addNewItemsInCartContent = async(cart_id, product_id, cart_quantity) => {

    const { rows } = await db.query(`
    INSERT INTO ${cart_content}(cart_id, product_id, cart_quantity)
    VALUES(${cart_id},${product_id},${cart_quantity})
    RETURNING *
    `)
    return rows
}

exports.deleteItemsInCartContent = async(cart_id) => {

    const { rows } = await db.query(`
    DELETE FROM ${cart_content}
    WHERE "cart_id" = '${cart_id}'
    RETURNING *
    `)

    return rows;
}

exports.deleteItemByNameInCartContent = async(cart_content_id) => {

    const { rows } = await db.query(`
    DELETE FROM ${cart_content}
    WHERE "cart_content_id" = '${cart_content_id}'
    RETURNING *`);

    return rows;
}

exports.updateItemsInCartContent = async(cart_id, product_id, new_quantity) => {

    const { rows } = await db.query(`
    UPDATE ${cart_content}
    SET "cart_quantity" = '${new_quantity}'
    WHERE "cart_id" = '${cart_id}' AND "product_id" = '${product_id}'
    RETURNING*
    `);

    return rows;
}

exports.updateCartContent = async(strQuery) => {

    // console.log("strquery: ", strQuery);
    const { rows } = await db.query(`${strQuery}`);

    return rows;

}

exports.getCartContentByIdCart = async(cart_id) => {

    const { rows } = await db.query(`
    SELECT *
    FROM ${cart_content} CC JOIN public.images IMG ON  CC.product_id = IMG.product_id  AND IMG.image_id = 1,
    public.products PD
    WHERE CC.cart_id =${cart_id} AND PD.product_id = CC.product_id
    `);

    return rows;
}


exports.getTotalQuantity = async(cartID) => {

    const { rows } = await db.query(`
    SELECT SUM(CRT.cart_quantity)
    FROM  ${cart_content} CRT
    WHERE "cart_id" = '${cartID}'
    `);

    return rows;
}