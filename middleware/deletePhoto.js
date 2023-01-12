import express from "express";
import fs from "fs";
import Post from "../models/Post.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();

export const deletePostPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findOne({ _id: id });

    const picturePath = await post.picturePath;
    if (picturePath === "") {
      next();
    } else {
      const public_id = await picturePath.split("/").pop().split(".")[0];
      const postUserStringId = await post.userId.toString();
      if (postUserStringId !== userId) {
        return res
          .status(404)
          .json({ message: "You are not author of this post!" });
      }
      cloudinary.uploader
        .destroy(`snap-shot/post/${public_id}`)
        .then((result) => {
          next();
        })
        .catch((error) => {
          throw error;
        });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
