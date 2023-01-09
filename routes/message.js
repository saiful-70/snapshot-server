import express from "express";
import { addMessage, getMessages } from "../controllers/message.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, addMessage);

router.get("/:chatId", verifyToken, getMessages);

export default router;
