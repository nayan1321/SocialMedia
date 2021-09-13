const mongoose = require("mongoose");
const multer = require("multer");
const Comment = require("./comments.model");
const fileStorageSystem = require("../helper/multer");

var Schema = mongoose.Schema;
const postSchema = new mongoose.Schema(
   {
      PostTitle: {
         type: String,
         required: true,
      },
      PostDescription: {
         type: String,
         required: true,
      },
      PostMedia: {
         type: String,
         required: true,
      },
      PostComments: [
         {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Comment",
         },
      ],
      UserID: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: "User",
      },
   },
   {
      timestamps: true,
   }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
