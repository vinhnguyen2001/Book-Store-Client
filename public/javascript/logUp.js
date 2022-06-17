const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
// const userName = document.getElementById("userName");
const password = document.getElementById("password");
const phoneNumber = document.getElementById("phone");
const form = document.querySelector('.form');



form.onsubmit = async(e) => {

    e.preventDefault();
    const errs = checkInputs();
    const firstNameValue = firstName.value.trim();
    const lastNameValue = lastName.value.trim();
    const passvalue = password.value.trim();
    const phonevalue = phoneNumber.value.trim();
    // const fullnamevalue = fullName.value.trim();
    const data = { firstNameValue, lastNameValue, phonevalue, passvalue, errs };


    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // chuyển đổi thành json và truyền đi
        body: JSON.stringify(data),
    }
    try {
        const result = await fetch('/auth/logup', options);
        const resData = await result.json();

        // console.log("resdata", resData);
        // lấy error về và thông báo lỗi
        if (!resData.status) {
            if (resData.firstNameErr != '') {
                setErrorFor(firstName, resData.firstNameErr);
            } else {
                setSuccessFor(firstName);
            }
            if (resData.lastNameErr != '') {
                setErrorFor(lastName, resData.lastNameErr);
            } else {
                setSuccessFor(lastName);
            }
            if (resData.phoneErr != '') {
                setErrorFor(phoneNumber, resData.phoneErr);
            } else {
                setSuccessFor(phoneNumber);
            }
            if (resData.passErr != '') {
                setErrorFor(password, resData.passErr);
            } else {
                setSuccessFor(password);
            }
        } else {

            location.assign('/homepage');
        }

    } catch (err) {
        console.log("error signup: ", err);
    }
};


function checkInputs() {

    // trim to remove the whitespaces
    const phoneNumberValue = phoneNumber.value.trim();
    errs = { phoneErr: '' };


    // check validation phoneNumber
    if (phoneNumberValue === '') {
        errs.phoneErr = "Số điện thoại không được để trống";
    } else {
        errs.phoneErr = isPhoneNumber(phoneNumberValue);
    }

    return errs;
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-item error';
    small.innerText = message;
}

function checkCapitalizeTheFirstLetterOfEachWord(words) {

    for (var i = 0; i < words.length - 1; i++) {

        if (i == 0) {
            if (words[0] != words[0].toUpperCase()) {
                return false;
            }
        }

        if (words[i] === ' ') {
            if (words[i + 1] != words[i + 1].toUpperCase()) {
                return false;
            }
        }
    }
    return true;
}

function isUserName(userN) {
    var userNamePattern = /^[a-zA-Z]+\w+$/i.test(userN);
    var err = ''
    if (!userNamePattern) {

        var temp = userN.charCodeAt(0);

        if (48 <= temp && temp <= 57) {
            err = 'Kí tự đầu tên đăng nhập không bắt đầu từ kí số';
            return err;
        }

        for (var i = 1; i < userN.length; i++) {
            if (userN[i] == " ") {
                err = 'Tên đăng nhập không chứa khoảng trắng';
                return err;
            }
        }

    }
    return err;
}

// kiểm tra dữ liệu số điện thoại

function isPhoneNumber(phone) {

    var err = ''

    var phoneNumberPattern = /^[0]\d{2}[-\s]*?\d{3}[-\s]*?\d{4}$/.test(phone);

    if (!phoneNumberPattern) {
        var phoneNumberLength = phone.length;
        if (parseInt(phone[0]) != 0) {

            err = 'Chữ số đầu tiên phải là số 0';
            return err;
        } else if (10 < phoneNumberLength) {

            err = 'Số điện thoại nhiều hơn 10 số';
            return err;
        } else if (phoneNumberLength < 10) {

            err = 'Số điện thoại ít hơn 10 số';
            return err;
        }
    }
    return err;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-item success';
}