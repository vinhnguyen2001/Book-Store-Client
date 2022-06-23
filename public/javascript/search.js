const formSelect = document.querySelector('#form-filter');
// const checkItem = document.querySelectorAll('.form__check--item');
const product = document.querySelector('.product');
console.log(window.location);
// product.innerHTML = `<div class="loader"></div>`;

// window.onload = () => {
//     product.classList.remove = "loader";
// }

// window.addEventListener("load", () => {
//     product.classList.remove = "loader";
// });
// product.innerHTML = ``;
// const minInputPrice = document.querySelector("#range-slider-min-input");
// const maxInputPrice = document.querySelector("#range-slider-max-input");
const inputValue = document.querySelectorAll(".numberVal input");
const filterValue = document.querySelector("#brand-filter");

console.log("value:", filterValue, filterValue.value);

formSelect.onsubmit = async(e) => {
    e.preventDefault();
    const search = document.querySelector("#search").value.trim().toLowerCase();
    const lowerPrice = parseInt(range[0].value);;
    const upperPrice = parseInt(range[1].value);;
    const data = { search, lowerPrice, upperPrice, filter: filterValue.value };



    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // chuyển đổi thành json và truyền đi
        body: JSON.stringify(data),
    }

    try {

        const path_name = window.location.pathname;
        let routeFetch = `${path_name}`;
        // formSelect.acttion
        if (path_name == "/search") {
            routeFetch = "/search";
        }
        const resJson = await fetch(routeFetch, options);
        const { data, total_page, id_subject, name_subject } = await resJson.json();

        product.innerHTML = "";
        if (data.length == 0) {
            $(".product").append(` 
            <div id="notfound">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h2>
                Không tìm thấy sản phẩm phù hợp 
             </h2></div>
            `)
            return;
        }
        for (let elm of data) {
            $(".product").append(
                `
                <div class="product__item" onmouseover="showPurchasegoods(this)" onmouseout="hidePurchasegoods(this)">
                <div class="product__item--img img--bitis">
                    <img src="${elm.image_link}" alt="photo1" width="100%">
                </div>
                <div class="product__name">
                    <a href="/book/${elm.product_id}/detail">
                        <p class="p-name">${elm.product_name}</p>
                    </a>
                </div>
    
                <div class="product__price">
                    ${elm.price} đ
                </div>
                <div class="product__buy btn" onclick="addItem(this)">
                    <button>
                        Thêm vào giỏ hàng 
                    </button>
                </div>
                <div class="product_id" style="display:none">${elm.product_id}</div>
            </div>
            `
            )

        }

        if (total_page) {
            const pagination = document.querySelector(".pagination");
            pagination.innerHTML = ``;

            for (let i = 1; i < total_page + 1; i++) {
                pagination.innerHTML += `
                <div class="page-item lower-item">
                <a href="/subject/${id_subject}/${name_subject}?page=${i}&filter=${filterValue.value}&lowerPrice=${range[0].value}&upperPrice=${range[1].value}">${i}</a>
                </div>
                `
            }
        }

    } catch (e) {
        console.error("error search: ", e);
    }

}

const selectSize = (obj) => {
    if (obj.classList.contains('check-active')) {
        obj.classList.remove('check-active');
    } else {
        obj.classList.add('check-active');
    }

}

const turnUp = (obj) => {

    var elmChidlFront = obj.children[0];
    var elmChidlBack = obj.children[1];

    elmChidlFront.style.display = "none";
    elmChidlBack.style.display = "block";

}

const disappear = (obj) => {
    var elmChidlFront = obj.children[0];
    var elmChidlBack = obj.children[1];

    elmChidlFront.style.display = "block";
    elmChidlBack.style.display = "none";
}

const showPurchasegoods = (obj) => {
    var btnPurchase = obj.children[3];
    btnPurchase.style.display = "block";
}
const hidePurchasegoods = (obj) => {
    var btnPurchase = obj.children[3];
    btnPurchase.style.display = "none";
}

const range = document.querySelectorAll('.range-slider input');
const progress = document.querySelector(".range-slider .progress");
let gap = 50000;


var showingPrice = (price) => {

    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g, '$1.');
}

range.forEach(input => {
    input.addEventListener('input', e => {
        let minrange = parseInt(range[0].value);
        let maxrange = parseInt(range[1].value);

        if (maxrange - minrange < gap) {

            if (e.target.className === "range-min") {
                range[0].value = maxrange - gap;
                range[0].style.zIndex = "2";

            } else {
                range[1].value = minrange + gap;
                range[1].style.zIndex = "2";

            }
            progress.style.left = (minrange / range[0].max) * 100 + '%';
            progress.style.right = 100 - (maxrange / range[1].max) * 100 + '%';
        } else {
            progress.style.left = (minrange / range[0].max) * 100 + '%';
            progress.style.right = 100 - (maxrange / range[1].max) * 100 + '%';

            inputValue[0].value = showingPrice(minrange) + " đ";
            inputValue[1].value = showingPrice(maxrange) + " đ";
        }
    })
})