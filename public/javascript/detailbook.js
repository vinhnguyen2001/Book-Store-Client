window.onload = () => {

    const sendButton = document.querySelector("#sendbtn");
    const inputCmt = document.querySelector("#cmt-content");
    const productValue = document.querySelector(".product_id");
    const commentList = document.querySelector(".comment-items");

    console.log(productValue);


    sendButton.addEventListener("click", async() => {
        try {

            if (inputCmt.value.trim() == '') {
                return showErrorModal("Bạn vui lòng nhập thông tin bình luận");

            }
            const data = { commentMSG: inputCmt.value, productID: productValue.innerText };


            console.log(data);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // chuyển đổi thành json và truyền đi
                body: JSON.stringify(data),
            }

            const resJson = await fetch('/comment/addnewcomment', options);
            const { status, fullname } = await resJson.json();

            if (status == 'no-access-token') {
                return showErrorModal("Bạn vui lòng đăng nhập để thực hiện chức năng này");
            } else if (status == "error") {
                showErrorModal("Vui lòng không nhập các kí tự đặt biệt");
                // sleep(1500)
                // location.assign(`${window.location.pathname}`);
                return;
            }

            if (status == "success") {

                commentList.innerHTML =

                    ` <div class="comment-item">
                        <div class="cmt-avatar">
                            <img src="../../img/firstpic.jpg" alt="avatar-photo">
                        </div>
                        <div class="cmt-msg">
                        <h4><b>${fullname}</b></h4>
                        <p>${inputCmt.value}</p>
                        </div>
                        </div>
                    ${commentList.innerHTML}
                    `;
                inputCmt.value = "";
                showSuccessToast(`Chúng tôi đã ghi lại bình luận của bạn !`)
            }

            // console.log("status", status);

        } catch (err) {
            console.log("error add commnet: ", err);
        }
    });
}