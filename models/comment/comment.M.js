const db = require('../db');
const comment = "public.comments";

exports.addNewComment = async(accountID, productID, commentMSG) => {


    const { rows } = await db.query(

        `
        INSERT INTO 
        ${comment} (product_id, account_id, comment_time, comment_body, comment_status)
        VALUES('${productID}', '${accountID}', NOW()::timestamp,'${commentMSG}',0)

        RETURNING * 
        `
    );

    return rows;
}

exports.getAllCommentByProdID = async(productID) => {

    const { rows } = await db.query(`
    
    SELECT * 
    FROM ${comment}  CMT JOIN public.accounts ACT ON CMT.account_id = ACT.account_id
    WHERE CMT.product_id = ${productID} AND CMT.comment_status = 1
    ORDER BY CMT.comment_id DESC 
    `);

    return rows;
}