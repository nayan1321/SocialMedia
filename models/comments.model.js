const mongoose = require("mongoose");
const User = require("./users.model");
const Post = require("./posts.model");

var Schema = mongoose.Schema;
const commentsSchema = new mongoose.Schema(
   {
      Title: {
         type: String,
         required: true,
      },
      UserID: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },

      PostID: {
         type: Schema.Types.ObjectId,
         ref: "Post",
      },
   },
   {
      timestamps: true,
   }
);
const Comment = mongoose.model("Comment", commentsSchema);
module.exports = Comment;
