const db = require('../db');
const accounts = "public.accounts";

exports.phoneIsExist = async(phone) => {

    const { rows } = await db.query(
        ` SELECT * FROM ${accounts} WHERE "phone" = '${phone}'`
    )

    return rows;
}


exports.addNewAccount = async(firstName, lastName, phone, password) => {

    // console.log(firstName, lastName, phone, password)
    const { rows } = await db.query(
        `INSERT INTO  ${accounts}("pwd","firstname", "lastname", "phone","role_id","account_status") 
         VALUES  ('${password}', '${firstName}','${lastName}','${phone}',1,1)
         RETURNING *
        `
    )
    console.log(rows)
    return rows;
}

exports.getAccountById = async(account_id) => {

    const { rows } = await db.query(`
    SELECT *
    FROM  ${accounts}
    WHERE "account_id" ='${account_id}'  
    `);

    return rows;
}


exports.updateAccountByIDAccount = async(account_id, firstname, lastname, phone, address, ward, district, province) => {

    const { rows } = await db.query(` 
    UPDATE ${accounts}
    SET "firstname"='${firstname}', "lastname"='${lastname}', "phone"='${phone}', "address"='${address}', "ward"='${ward}', "district"='${district}', "province"='${province}'
    WHERE "account_id"='${account_id}'
    
    RETURNING *`);

    return rows;
}