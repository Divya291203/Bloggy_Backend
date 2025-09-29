import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import {
	generateBlogPost,
	generateBlogPostIdeas,
	generateBlogPostSummary,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-blog-post", protect, generateBlogPost);
router.post("/generate-blog-post-ideas", protect, generateBlogPostIdeas);
router.post("/generate-blog-post-summary", protect, generateBlogPostSummary);

export default router;
