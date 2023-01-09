import express from "express";

import {
  getUser,
  getUserFriends,
  addRemoveFriends,
  editProfile,
  getUserBySearch,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";
import { uploadProfilePic } from "../middleware/uploadPhoto.js";

const router = express.Router();

// create
router.post("/search", verifyToken, getUserBySearch);

// read
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// update
router.patch("/:id/:friendId", verifyToken, addRemoveFriends);
router.patch(
  "/:id",
  verifyToken,
  uploadProfilePic.single("picture"),
  editProfile
);

export default router;
