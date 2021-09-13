const express = require("express");

const User = require("../models/users.model");
const Post = require("../models/posts.model");
const Comment = require("../models/comments.model");

//addPost
//singleFileUpload
exports.singleFileUpload = async (req, res) => {
   try {
      const file = req.file;
      const post = new Post({
         PostTitle: req.body.PostTitle,
         PostDescription: req.body.PostDescription,
         PostMedia: file.path,
         UserID: req.user._id,
      });
      await post.save();

      //update and store the postid in user collections
      const postID = await User.findOneAndUpdate(
         { _id: req.user._id },
         { $push: { Posts: post._id } },
         { new: true }
      );
      await postID.save();

      res.send({ post });
   } catch (error) {
      res.status(500).send(error);
   }
};

//myPosts
exports.myPosts = async (req, res) => {
   try {
      console.log(req.user._id);
      const post = await Post.find({ UserID: req.user._id }).populate(
         "PostComments"
      );
      const comment = await Comment.find({ UserID: req.user._id });
      const cmtLength = comment.length;

      res.send({ post, "My Total Comments is:- ": cmtLength });
   } catch (error) {
      res.status(500).send(error);
   }
};
