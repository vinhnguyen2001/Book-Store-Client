const express = require("express");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// const {  } = require("../../models/product/products.M");
const { addNewCarts } = require("../../models/cart/cart.M");
const { phoneIsExist, addNewAccount } = require("../../models/account/account.M");

// Hàm xử lí lỗi
handleError = (e) => {

    errs = { firstNameErr: '', lastNameErr: '', phoneErr: '', passErr: '' };

    // phần lỗi họ
    if (e.message == 'Họ không được để trống') {
        errs.firstNameErr = 'Họ không được để trống';
        return errs;
    }

    // phần lỗi tên
    if (e.message == 'Tên không được để trống') {
        errs.lastNameErr = 'Tên không được để trống';
        return errs;
    }

    // phần lỗi cho số điện thoại


    if (e.message == 'Số điện thoại không được để trống') {
        errs.phoneErr = 'Số điện thoại không được để trống';
        return errs;
    }
    if (e.message == 'Chữ số đầu tiên phải là số 0') {
        errs.phoneErr = 'Chữ số đầu tiên phải là số 0';
        return errs;
    }
    if (e.message == 'Số điện thoại nhiều hơn 10 số') {
        errs.phoneErr = 'Số điện thoại nhiều hơn 10 số';
        return errs;
    }
    if (e.message == 'Số điện thoại ít hơn 10 số') {
        errs.phoneErr = 'Số điện thoại ít hơn 10 số';
        return errs;
    }

    if (e.message == 'Số điện thoại đã tồn tại') {
        errs.phoneErr = 'Số điện thoại đã tồn tại';
        return errs;
    }

    // phần lỗi password
    if (e.message == 'Mật khẩu không được để trống') {
        errs.passErr = 'Mật khẩu không được để trống';
        return errs;
    }

    if (e.message == "Mật khẩu quá ngắn") {
        errs.passErr = 'Mật khẩu quá ngắn';
        return errs;
    }
}
const createJWToken = (id, name, role) => {
    // thêm id_user và role_id vào trong token
    const data = {
        id: id,
        name: name,
        role: role,
    };
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '24h',
    });
};


// GET /logup
router.get('/', async(req, res) => {

    try {
        let bookID = req.params.id;

        res.render("auth/logup", {
            title: "Đăng kí | Blue Book Store ",
            cssCs: () => "auth/logup/css",
            scriptCs: () => "auth/logup/script",
        });

    } catch (err) {
        throw Error(err);
    }
});


//[POST] /logup
router.post("/", async(req, res) => {

    const { firstNameValue, lastNameValue, phonevalue, passvalue, errs } = req.body;
    console.log(req.body)
    try {

        if (firstNameValue == '') {
            throw Error("Họ không được để trống");
        }
        if (lastNameValue == '') {
            throw Error("Tên không được để trống");
        }

        if (errs.phoneErr != '') {
            throw Error(errs.phoneErr);
        }



        // Kiểm tra số điện thoại đã tồn tại trong db hay chưa

        const phoneData = await phoneIsExist(phonevalue)
        if (phoneData.length > 0) {
            throw Error('Số điện thoại đã tồn tại');
        }

        if (passvalue === '') {
            throw Error("Mật khẩu không được để trống");
        } else if (passvalue.length < 8) {
            throw Error("Mật khẩu quá ngắn");
        }


        // hash password
        const salt = await bcrypt.genSalt(); // Thêm muối
        const pwdHashed = await bcrypt.hash(passvalue, salt);
        console.log(pwdHashed)
            //lưu vào database table user
        const newUser = await addNewAccount(firstNameValue, lastNameValue, phonevalue, pwdHashed);

        // lưu vào trong database table carts
        const newCart = await addNewCarts(newUser[0].account_id);


        // //tạo token cho client
        const token = createJWToken(newUser[0].account_id, newUser[0].lastname, newUser[0].role_id);
        const access_token = `Beaer ${token}`;
        res.cookie('jwt', access_token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ status: 'success' });
        // res.redirect('/homepage');


    } catch (e) {
        const errs = handleError(e);
        console.log(errs);
        res.status(400).json(errs);
    }
});

module.exports = router;