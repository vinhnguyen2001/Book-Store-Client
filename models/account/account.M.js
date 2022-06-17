const db = require('../db');
const accounts = "public.accounts";

exports.phoneIsExist = async(phone) => {

    const { rows } = await db.query(
        ` SELECT * FROM ${accounts} WHERE "phone" = '${phone}'`
    )

    return rows;
}


exports.addNewAccount = async(firstName, lastName, phone, password) => {

    console.log(firstName, lastName, phone, password)
    const { rows } = await db.query(
        `INSERT INTO  ${accounts}("pwd","firstname", "lastname", "phone","role_id","account_status") 
         VALUES  ('${password}', '${firstName}','${lastName}','${phone}',2,1)
         RETURNING *
        `
    )
    console.log(rows)
    return rows;
}