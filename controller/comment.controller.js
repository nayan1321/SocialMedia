const express = require("express");
const { find } = require("../models/comments.model");

const Comment = require("../models/comments.model");
const Post = require("../models/posts.model");
const User = require("../models/users.model");

//ADD Comments
exports.addCmt = async (req, res) => {
   const _id = req.params.id;
   const comment = new Comment({
      ...req.body,
      UserID: req.user._id,
      PostID: _id,
   });

   try {
      await comment.save();

      //update and store the postid in user collections
      const user = await User.findOneAndUpdate(
         { _id: req.user._id },
         { $push: { Comments: comment._id } },
         { new: true }
      );
      await user.save();

      //store the post commentID in post collections
      const post = await Post.findOneAndUpdate(
         { _id: _id },
         { $push: { PostComments: comment._id } },
         { new: true }
      );
      await post.save();

      res.send({ comment });
   } catch (error) {
      res.status(500).send(error);
   }
};

//My Comments with Related Posts
exports.myComments = async (req, res) => {
   try {
      const comments = await Comment.find({ UserID: req.user._id }).populate(
         "PostID"
      );
      console.log(req.user._id);
      res.send(comments);
   } catch (error) {
      res.status(500).send(error);
   }
};
