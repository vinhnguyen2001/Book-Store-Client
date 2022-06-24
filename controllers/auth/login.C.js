const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { phoneIsExist, addNewAccount } = require("../../models/account/account.M");



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


// Hàm xử lí lỗi
const handleError = (e) => {

    errs = { phoneErr: '', passErr: '' };

    // phần lỗi tên đăng nhập
    if (e.message == 'Số điện thoại không được để trống') {
        errs.phoneErr = 'Số điện thoại không được để trống';
        return errs;
    }
    if (e.message == 'Số điện thoại chưa được đăng kí') {
        errs.phoneErr = 'Số điện thoại chưa được đăng kí';
        return errs;
    }

    // phần lỗi password
    if (e.message == 'Mật khẩu không được để trống') {
        errs.passErr = 'Mật khẩu không được để trống';
        return errs;
    }
    if (e.message == 'Mật không không chính xác') {
        errs.passErr = 'Mật không không chính xác';
        return errs;
    }
}

// GET /login
router.get('/', async(req, res) => {

    try {
        if (res.locals.user) {
            return res.redirect("/homepage");
        }
        res.render("auth/login", {
            title: "Đăng nhập | Blue Book Store ",
            cssCs: () => "auth/login/css",
            scriptCs: () => "auth/login/script",
        });

    } catch (err) {
        throw Error(err);
    }
});

// [POST] /login

router.post('/', async(req, res) => {

    const { phonevalue, passvalue } = req.body;
    try {

        if (phonevalue == '') {
            throw Error("Số điện thoại không được để trống");
        }

        const userData = await phoneIsExist(phonevalue);

        if (userData.length == 0) {
            throw Error("Số điện thoại chưa được đăng kí");
        }
        if (passvalue === '') {
            throw Error("Mật khẩu không được để trống");
        }

        // check mật khẩu đúng hay sai.
        const isPwd = await bcrypt.compare(passvalue, userData[0].pwd);
        if (!isPwd) {
            throw Error("Mật không không chính xác");
        }

        //tạo token cho client
        const token = createJWToken(userData[0].account_id, userData[0].lastname, userData[0].role_id);

        // Lưu trữ token ở cookie
        const access_token = `Beaer ${token}`;
        res.cookie('jwt', access_token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ status: 'success', role: userData[0].role_id });

    } catch (e) {
        const errs = handleError(e);
        res.status(400).json(errs);
    }
});

module.exports = router;