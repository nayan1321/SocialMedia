const express = require("express");
const router = express.Router();
const comment_cotroller = require("../controller/comment.controller");
const auth = require("../helper/auth");

const authenticateJWT = auth.auth;

//addComments
router.post("/addcomment/:id", authenticateJWT, comment_cotroller.addCmt);
//MyComments
router.get("/mycomments/", authenticateJWT, comment_cotroller.myComments);

module.exports = router;
