const addItem = async(obj) => {
    const parentElement = obj.parentNode;
    const idBook = parentElement.querySelector(".product_id").innerText;
    const cartAmount = document.querySelector("#cart-amount");
    console.log("cart: ", cartAmount);

    const hostOrigin = window.location.origin;
    const pathname = window.location.pathname;

    try {
        const data = { id: idBook };
        console.log(data);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // chuyển đổi thành json và truyền đi
            body: JSON.stringify(data),
        }


        const resJson = await fetch('/shopping-cart/add-item', options);
        const { status } = await resJson.json();

        if (status == 'success') {
            var url = window.location.href;
            url = `${url}`;
            cartAmount.innerText = parseInt(cartAmount.innerText) + 1;
            return showSuccessModalForBuying("Thêm vào giỏ hàng thành công ", "true");
        } else if (status == "outofproduct") {
            return showErrorModal("Sản phẩm đã hết hàng");
        } else {
            if (status == 'no-access-token') {
                return showErrorModal("Bạn chưa đăng nhập");
            }
        }

    } catch (err) {
        console.log("error item adds to card: ", err);
    }
}

const addItemDetail = async(obj) => {

    const size = document.querySelector(".size-detail-active");
    console.log(size);

    if (!size) {
        alert("Bạn vui lòng chọn kích thước");
        return;
    }
    const pathname = window.location.pathname;
    var idShoe = pathname[7];
    for (let index = 8; index < pathname.length; index++) {
        if (pathname[index] == '/') {
            break;
        }
        idShoe += pathname[index];
    }

    try {
        const data = { size: size.innerText, id: idShoe };
        console.log(data);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // chuyển đổi thành json và truyền đi
            body: JSON.stringify(data),
        }


        const resJson = await fetch('/add-item', options);
        const { status } = await resJson.json();

        if (status == 'success') {
            var url = window.location.href;
            url = `${url}`;

            showSuccessModalForBuying("Thêm vào giỏ hàng thành công ", "true");
        } else {
            if (status == 'no-access-token') {
                showErrorModal("Bạn chưa đăng nhập");
            }
        }

    } catch (err) {
        console.log("error item adds to card: ", err);
    }
}