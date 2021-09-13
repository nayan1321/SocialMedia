const express = require("express");
const router = express.Router();
const auth = require("../helper/auth");
const fileFilter = require("../helper/multer");
const post_controller = require("../controller/post.controller");
const authenticateJWT = auth.auth;

//addPost posts
router.post(
   "/addPost/",
   [authenticateJWT, fileFilter.singleUpload()],
   post_controller.singleFileUpload
);

//myPosts
router.get("/myPosts/", [authenticateJWT], post_controller.myPosts);

module.exports = router;
