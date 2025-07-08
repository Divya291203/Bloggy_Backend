import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
	createComment,
	deleteComment,
	editComment,
	getComments,
	getPostComments,
	likeComments,
	reply,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", protect, createComment);
router.get("/get-all-comments", getComments);
router.get("/get-post-comments/:id", getPostComments);
router.delete("/delete", protect, deleteComment);
router.put("/edit", protect, editComment);
router.post("/like", protect, likeComments);
router.post("/reply", protect, reply);

export default router;
