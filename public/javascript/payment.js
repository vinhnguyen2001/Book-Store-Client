const API_PROVINCE_URL = `https://provinces.open-api.vn/api/?depth=1`
const API_DISTRICT_URL = `https://provinces.open-api.vn/api/d/`
const API_WARD_URL = `https://provinces.open-api.vn/api/w`
var times = 0;

const provincesHTML = document.querySelector(".form-province");

const btnPayment = document.querySelector("#btn-payment");
btnPayment.addEventListener("click", () => {

    console.log("vao khong");
    if (provincesHTML.innerText == "Rỗng") {
        showErrorModal("Bạn chưa chọn địa chỉ");
    }
});

window.addEventListener("load", () => {
    const loadData = async() => {

        const resJson = await fetch(`${API_PROVINCE_URL}`);
        const data = await resJson.json();
        const provinceValue = document.querySelector(".form-province");
        const districtHTML = document.querySelector(".form-district");
        const wardHTML = document.querySelector(".form-ward");

        var provinces = data.map((elm) => elm.name);
        var htmls = `<option>Rỗng</option>`;
        for (elm of provinces) {
            console.log("elm", typeof(elm), typeof(provinceValue.value));

            if (provinceValue.value != "Rỗng" && String(provinceValue.value) == String(elm)) {
                htmls += `<option selected="selected">${elm}</option>`
            } else {
                htmls += `<option>${elm}</option>`
            }
        }

        provincesHTML.innerHTML = "";
        provincesHTML.innerHTML = htmls;

        return data;
    }


    const data = loadData();

    const chooseProvince = async(data) => {
        const resJson = await fetch(`${API_DISTRICT_URL}`);
        const dataDistrict = await resJson.json();
        const provincesHTML = document.querySelector(".form-province");
        const districtHTML = document.querySelector(".form-district");
        const districtValue = document.querySelector(".form-district");
        const wardValue = document.querySelector(".form-ward");



        const resJsonW = await fetch(`${API_WARD_URL}`);
        const dataWard = await resJsonW.json();
        const wardHTML = document.querySelector(".form-ward");
        var province_code = 0;
        var childchoose = () => {

            data.then(function(result) {
                    var htmls = ``;
                    province_code = result.find((element) => element.name == `${provincesHTML.value}`);
                    for (elm of dataDistrict) {

                        if (elm.province_code == province_code.code) {

                            if (elm.name == districtValue.value) {
                                htmls += `<option selected>${elm.name}</option>`
                            } else {
                                htmls += `<option>${elm.name}</option>`
                            }
                        }
                    }


                    districtHTML.innerHTML = "";
                    districtHTML.innerHTML = htmls;
                    htmls = ``;
                    const district_code = dataDistrict.find((element) => element.name == `${districtHTML.value}`);
                    console.log("geted: ", district_code);
                    var flag = false;
                    for (elm of dataWard) {
                        if (elm.district_code == district_code.code) {
                            flag = true;

                            if (wardValue.value == elm.name) {
                                htmls += `<option selected>${elm.name}</option>`;

                            } else {
                                htmls += `<option>${elm.name}</option>`;
                            }
                        }
                    }

                    if (flag == false) {
                        htmls = `<option>Rỗng</option>`;
                    }
                    wardHTML.innerHTML = "";
                    wardHTML.innerHTML = htmls;

                })
                .catch((err) => {
                    console.error("error", err)
                });

            var htmls = ``;
        }
        provincesHTML.addEventListener("click", () => {
            if (provincesHTML.value === "Rỗng") {
                districtHTML.innerHTML = `<option>Rỗng</option>`;
                wardHTML.innerHTML = `<option>Rỗng</option>`;
                return;
            }
            childchoose();
        });

        provincesHTML.click();
        return dataDistrict;
    }



    const chooseWards = async() => {
        const resJson = await fetch(`${API_WARD_URL}`);
        const dataWard = await resJson.json();
        const districtHTML = document.querySelector(".form-district");
        const wardHTML = document.querySelector(".form-ward");
        const wardValue = document.querySelector(".form-ward");


        districtHTML.addEventListener("click", () => {
            dataDistrict.then(function(result) {
                    var htmls = ``;
                    const district_code = result.find((element) => element.name == `${districtHTML.value}`);
                    console.log("geted: ", district_code);

                    var flag = false;
                    for (elm of dataWard) {

                        if (elm.district_code == district_code.code) {
                            flag = true;
                            if (wardValue.value == elm.name) {
                                htmls += `<option selected>${elm.name}</option>`;

                            } else {
                                htmls += `<option>${elm.name}</option>`;
                            }
                        }
                    }

                    if (flag == false) {
                        htmls = `<option>Rỗng</option>`;
                    }
                    wardHTML.innerHTML = "";
                    wardHTML.innerHTML = htmls;
                })
                .catch((err) => {
                    console.error("error", err)
                });
        });
    }

    const dataDistrict = chooseProvince(data);
    chooseWards();

});