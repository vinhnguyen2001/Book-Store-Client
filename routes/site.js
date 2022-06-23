const express = require('express');
const router = express.Router();
const { authenToken, authenTokenResApi, checkCurrentUser, checkUserIsLogin } = require("../middlewares/authentication.MW");

const { CommentControllers } = require("../controllers/Site/comment.C")
const commentCtls = new CommentControllers;

router.use('/', checkCurrentUser, require('../controllers/site/home.C'));
router.use('/search', require('../controllers/site/home.C'));
router.use('/comment/addnewcomment', commentCtls.addComment);

module.exports = router;