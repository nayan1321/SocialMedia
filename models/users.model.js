const mongoose = require("mongoose");
const validator = require("validator");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Post = require("./posts.model");
const Comment = require("./comments.model");
const { use } = require("../routes/user.route");
const { findOne } = require("./comments.model");

var Schema = mongoose.Schema;

var validateMobileNo = function (Mno) {
   var re = /^([+][9][1]|[9][1]|[0]){0,1}([7-9]{1})([0-9]{9})$/;
   return re.test(Mno);
};
// var validatePwd = function (Pwd) {
//    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
//    return re.test(Pwd);
// };
const userSchema = new mongoose.Schema(
   {
      FirstName: {
         type: String,
         required: true,
      },
      LastName: {
         type: String,
         required: true,
      },
      UserName: {
         type: String,
         required: true,
         unique: {
            args: true,
            msg: "UserName Already exists...",
         },
         validate(value) {
            if (!validator.isLowercase(value)) {
               throw new Error("Please Enter in LowerCase...");
            }
         },
      },
      Gender: {
         type: String,
         required: true,
         validate(value) {
            if (value !== "M" && value !== "F") {
               throw new Error('Please Enter "M" For Male And "F" for Female ');
            }
         },
      },
      MobileNo: {
         type: Number,
         required: true,
         unique: {
            args: true,
            msg: "Email address already in use!",
         },
         validate: [validateMobileNo, "Please Valid Mobile No..."],
      },
      UserMail: {
         type: String,
         required: true,
         unique: {
            args: true,
            msg: "USerMail Already exists...",
         },
         validate(value) {
            if (!validator.isEmail(value)) {
               throw new Error("Enter Valid Email Address...");
            }
         },
      },
      Password: {
         type: String,
         required: true,
         validate(value) {
            if (!validator.isStrongPassword(value)) {
               throw new Error("Enter Strong PassWord.");
            }
         },
      },
      Posts: [
         {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Post",
         },
      ],
      Comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Comment",
         },
      ],
      Tokens: [
         {
            Token: {
               type: String,
            },
         },
      ],
   },
   {
      timestamps: true,
   }
);

// ----------------------------------------------------------------------------------------------------------------------
//Validation For Unique UserName,Email,Mobile Number...
// userSchema.path("UserName").validate(async (UserName) => {
//    const userCount = await mongoose.models.User.countDocuments({ UserName });
//    return !userCount;
// }, "UserName already Exists...");

// userSchema.path("MobileNo").validate(async (MobileNo) => {
//    const noCount = await mongoose.models.User.countDocuments({ MobileNo });
//    return !noCount;
// }, "Mobile No already Exists");

// userSchema.path("UserMail").validate(async (UserMail) => {
//    const mailCount = await mongoose.models.User.countDocuments({ UserMail });
//    return !mailCount;
// }, "Mail already exists...");
// ----------------------------------------------------------------------------------------------------------------------

userSchema.virtual("Post", {
   ref: "Post",
   localField: "_id",
   foreignField: "_id",
});

//generateAuthToken
userSchema.methods.generateAuthToken = async function () {
   try {
      const user = this;
      const Token = jwt.sign({ _id: user._id.toString() }, "secretkey123");

      user.Tokens = user.Tokens.concat({ Token });
      console.log("Token:- ", user.Tokens);

      await user.save();

      return Token;
   } catch (error) {
      console.log(error);
   }
};

//findByCredentials
userSchema.statics.findByCredentials = async (UserMail, UserName, Password) => {
   try {
      const isEmail = await User.findOne({ UserMail });
      if (!isEmail) {
         throw new Error("Email is not Registered...");
      }

      const isUserName = await User.findOne({ UserName });
      if (!isUserName) {
         throw new Error("UserName is not Registered...");
      }

      var bytes1 = CryptoJS.AES.decrypt(isEmail.Password, "secretkey123");
      var orignalTextEmail = bytes1.toString(CryptoJS.enc.Utf8);
      var bytes2 = CryptoJS.AES.decrypt(isEmail.Password, "secretkey123");
      var orignalTextUname = bytes2.toString(CryptoJS.enc.Utf8);

      console.log(orignalTextEmail, isEmail.Password);
      console.log(orignalTextUname, isUserName.Password);

      if (orignalTextEmail === Password) {
         return isEmail;
      } else if (orignalTextUname === Password) {
         return isUserName;
      } else {
         throw new Error("incorrect Password...");
      }
   } catch (error) {
      const errMsg = error.message;
      return errMsg;
   }
};

//Public Profile
userSchema.methods.getPublicProfile = function () {
   const user = this;
   const userObject = user.toObject();

   delete userObject._id;
   delete userObject.Password;
   delete userObject.Tokens;
   delete userObject.__v;
   delete userObject.createdAt;
   delete userObject.updatedAt;

   return userObject;
};

//Pre Save
userSchema.pre("save", async function (next) {
   const user = this;

   if (user.isModified("Password")) {
      user.Password = await CryptoJS.AES.encrypt(
         user.Password,
         "secretkey123"
      ).toString();
   }
   next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
