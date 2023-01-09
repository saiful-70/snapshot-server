import express from "express";
import { uploadPostImage } from "../middleware/uploadPhoto.js";
import {
  getFeedPosts,
  getUserPosts,
  getSinglePost,
  likePost,
  commentPost,
  deletePost,
  deleteComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { createPost } from "../controllers/posts.js";
import { deletePostPhoto } from "../middleware/deletePhoto.js";

const router = express.Router();

// create
router.post("/", verifyToken, uploadPostImage.single("picture"), createPost);

// read
router.get("/", verifyToken, getFeedPosts);
router.get("/:id", verifyToken, getSinglePost);
router.get("/:userId/posts", verifyToken, getUserPosts);

// update
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
router.patch("/:id/comment/:commentId", verifyToken, deleteComment);

// delete
router.delete("/:id", verifyToken, deletePostPhoto, deletePost);

export default router;
