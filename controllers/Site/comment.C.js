const express = require("express");
const router = express.Router();

const { getAccountById, updateAccountByIDAccount, phoneIsExist } = require("../../models/account/account.M")

const { getAllCommentByProdID, addNewComment } = require("../../models/comment/comment.M");

class CommentControllers {


    async addComment(req, res) {

        try {
            if (!res.locals.user) {
                return res.status(403).json({ status: "no-access-token" });

            }
            const { commentMSG, productID } = req.body;
            // console.log("req.body: ", req.body);`

            const accountID = res.locals.user.id;

            const userData = await getAccountById(accountID);

            const newComment = await addNewComment(accountID, productID, commentMSG);

            if (newComment.length > 0) {
                return res.status(200).json({ status: "success", fullname: `${userData[0].firstname} ${userData[0].lastname}` });
            }
        } catch (err) {
            console.error(err);
            throw Error(err);
        }
    }
}


module.exports = { CommentControllers };