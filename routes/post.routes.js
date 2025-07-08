import express from "express";
import {
	createPost,
	deletePost,
	getPostById,
	getPosts,
	getDrafts,
	updatePost,
	getMyPosts,
} from "../controllers/post.controller.js";
import { protect, roleCheck } from "./../middlewares/authMiddleware.js";

const router = express.Router();

//routes
router.post(
	"/create-post",
	protect,
	roleCheck(["author", "admin"]),
	createPost
);
router.get("/", protect, getPosts);
router.get("/my-posts", protect, getMyPosts);
router.get("/drafts", protect, getDrafts);
router.get("/:id", protect, getPostById);
router.delete(
	"/delete-post",
	protect,
	roleCheck(["admin", "author"]),
	deletePost
);
router.put("/update/:id", protect, roleCheck(["author", "admin"]), updatePost);
export default router;
