import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// import { cloudinaryUploads } from "../config/cloudinary.js";
import fs from "fs";
// import Datauri from "datauri";
import Post from "../models/Post.js";
import User from "../models/User.js";

// create
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);
    let picturePath;

    if (req.file) {
      picturePath = req.file.path;
    } else {
      picturePath = "";
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath,
      userPicturePath: user.picturePath,
    });

    await newPost.save();
    const post = await Post.find().sort({ _id: -1 });

    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// read
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ _id: -1 });
    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ _id: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// update
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = await post.likes.includes(userId);

    if (isLiked) {
      await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
    } else {
      await Post.updateOne({ _id: id }, { $push: { likes: userId } });
    }

    const updatedPost = await Post.findById(id);

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;
    console.log(req.body);
    const user = await User.findOne({ _id: userId });

    await Post.updateOne(
      { _id: id },
      {
        $push: {
          comments: {
            userId: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userPicturePath: user.picturePath,
            text: text,
          },
        },
      }
    );

    const updatedPost = await Post.findOne({ _id: id });

    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    const user = await User.findOne({ _id: userId });
    const comment = await Post.findOne(
      { _id: id },
      { comments: { $elemMatch: { _id: commentId } } }
    );
    console.log(comment);
    const commentUserStringId = await comment.comments[0].userId.toString();
    if (commentUserStringId !== userId) {
      return res
        .status(404)
        .json({ message: "You are not author of this comment!" });
    }

    await Post.updateOne(
      { _id: id },
      { $pull: { comments: { _id: commentId } } }
    );

    const updatedPost = await Post.findOne({ _id: id });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// delete
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findOne({ _id: id });
    const postUserStringId = await post.userId.toString();
    if (postUserStringId !== userId) {
      return res
        .status(404)
        .json({ message: "You are not author of this post!" });
    }

    await Post.findOneAndDelete({ _id: id });
    res.status(200).json("Successfully deleted the post");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
