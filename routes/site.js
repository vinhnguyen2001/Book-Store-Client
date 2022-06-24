const express = require('express');
const router = express.Router();
const { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin } = require("../middlewares/authentication.MW");

const { CommentControllers } = require("../controllers/Site/comment.C");
const { HomeControllers } = require("../controllers/Site/home.C");

const commentCtls = new CommentControllers;
const homeCtls = new HomeControllers;


router.get('/', homeCtls.redirectFunction);
router.get('/homepage', homeCtls.loadHomepage);
router.get("/search", homeCtls.loadSearchGet);
router.post('/search', homeCtls.loadSearchPost);
router.get("/book/:id/detail", homeCtls.loadBookDetail);

router.post('/comment/addnewcomment', commentCtls.addComment);

module.exports = router;