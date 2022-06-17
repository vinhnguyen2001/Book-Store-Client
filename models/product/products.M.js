const db = require('../db');
const products = "public.products";

exports.getFiveProducts = async(firstID, secondID, thirdID, fourthID, fifthID) => {

    const { rows } = await db.query(`
    
    SELECT distinct(PD.product_id),* FROM ${products} PD JOIN images IM ON PD.product_id = IM.product_id
    WHERE  PD.product_id = ${firstID} OR PD.product_id = ${secondID} OR PD.product_id = ${thirdID}
    OR PD.product_id = ${fourthID} OR PD.product_id = ${fifthID}
    `)

    return rows;
}

exports.getDetailInforProduct = async(idProduct) => {

    const { rows } = await db.query(`
    SELECT * FROM ${products} PD JOIN public.authors ATH ON PD.author_id = ATH.author_id
    JOIN public.categories CG ON PD.category_id = CG.category_id
    WHERE  PD.product_id = ${idProduct} 

    `);

    return rows;
}


exports.showingPrice = (price) => {
    ``
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}