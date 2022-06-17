const phone = document.getElementById("phone");
const password = document.getElementById("password");
const form = document.querySelector('.form');

form.onsubmit = async(e) => {

    e.preventDefault();
    const phonevalue = phone.value.trim();
    const passvalue = password.value.trim();
    const data = { phonevalue, passvalue };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // chuyển đổi thành json và truyền đi
        body: JSON.stringify(data),
    }
    try {
        const result = await fetch('/auth/login', options);
        const resData = await result.json();

        console.log("resdata", "có vao ", resData);
        // lấy error về và thông báo lỗi

        if (!resData.status) {
            if (resData.phoneErr != '') {
                setErrorFor(phone, resData.phoneErr);

            } else {
                setSuccessFor(phone);
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
        console.log("error signin: ", err);
    }
};

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-item error';
    small.innerText = message;
}


function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-item success';
}