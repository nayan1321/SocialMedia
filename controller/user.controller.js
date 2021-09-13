const express = require("express");

const User = require("../models/users.model");
const Post = require("../models/posts.model");
const { use } = require("../routes/user.route");

//signin
exports.registerUser = async (req, res) => {
   const user = new User(req.body);
   try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token, msg: "User Registered..." });
   } catch (error) {
      return res.status(500).send(error);
   }
};

//login
exports.login = async (req, res) => {
   try {
      const user = await User.findByCredentials(
         req.body.UserMail,
         req.body.UserName,
         req.body.Password
      );
      if (user.UserMail === req.body.UserMail) {
         const token = await user.generateAuthToken();
         res.send({
            msg: "User Log in...",
            token,
         });
      } else {
         res.send({ user });
      }
   } catch (error) {
      res.status(500).send(error);
   }
};

//user profile
exports.user = async (req, res) => {
   try {
      //    const users = await User.find({});
      //    res.send(users);
      //const user = req.user;
      //res.send({ user: user.getPublicProfile() });

      const user = await User.findOne({ _id: req.user._id }).populate(
         "Posts Comments"
      );
      res.status(200).send(user);
   } catch (error) {
      res.status(500).send(error);
   }
};

//allUser
exports.allUser = async (req, res) => {
   try {
      const user = await User.find().populate("Posts Comments");
      res.status(200).send(user);
   } catch (error) {
      res.status(500).send(error);
   }
};
