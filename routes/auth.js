import express from "express";
import { uploadProfilePic } from "../middleware/uploadPhoto.js";
import { register } from "../controllers/auth.js";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", uploadProfilePic.single("picture"), register);
router.post("/login", login);

export default router;
