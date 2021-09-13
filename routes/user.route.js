const express = require("express");
const router = express.Router();
const auth = require("../helper/auth");
const fileFilter = require("../helper/multer");
const user_controller = require("../controller/user.controller");

//Sign Up Router
router.post("/signup/", user_controller.registerUser);
//login Router
router.post("/login/", user_controller.login);
//user Router
router.get("/user/", auth.auth, user_controller.user);
//all user
router.get("/alluser/", user_controller.allUser);
module.exports = router;
