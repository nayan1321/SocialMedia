const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

exports.auth = async (req, res, next) => {
   try {
      const token = req.header("Authorization").replace("Bearer ", "");
      // console.log("AUTH TOKEN", token);
      const decode = jwt.verify(token, "secretkey123");
      const user = await User.findOne({
         _id: decode._id,
         "Tokens.Token": token,
      });
      // console.log(user);
      if (!user) {
         throw new Error("User Not Registered!!!");
      }
      req.user = user;
      req.token = token;
      next();
   } catch (error) {
      res.status(500).send("Please Authenticate");
   }
};
