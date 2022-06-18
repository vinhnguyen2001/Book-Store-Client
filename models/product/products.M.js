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


exports.getProductsByName = async({ search: search = "", price: price = '', filter: filter = '' }) => {


        const { rows } = await db.query(`
    SELECT * FROM ${products} PD JOIN public.authors ATH  ON PD.author_id = ATH.author_id 
    JOIN public.images IMG ON IMG.product_id = PD.product_id AND IMG.image_id = 1
    WHERE PD.is_active = 1 
    ${search ? `AND PD.product_name like '%${search}%' OR ATH.author_name like '%${search}%'`:""}
    ${price} ${filter}
    `);

    return rows;
}

exports.updateStockInProduct = async(product_id,newstock) =>{

    const {rows} = await db.query(`
    UPDATE ${products}
    SET stock = ${newstock}
    WHERE product_id = ${product_id}
    `)

    return rows;
}

exports.getProductById = async(product_id)=>{

    const {rows} = await db.query(
        `
        SELECT *
        FROM ${products}
        WHERE product_id = ${product_id}
        `
    )

    return rows;
}