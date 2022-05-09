const db = require('../db');
const products = "public.products";

exports.getFiveProducts = async(firstID, secondID, thirdID, fourthID, fifthID) => {

    const { rows } = await db.query(`
    
    SELECT * FROM ${products} 
    WHERE  "product_id" = '${firstID}' OR "product_id" = '${secondID}' OR "product_id" = '${thirdID}'
    OR "product_id" = '${fourthID}' OR "product_id" = '${fifthID}'
    `)

    return rows;
}



exports.showingPrice = (price) => {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}