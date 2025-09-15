import express from "express";
import {
	generateBlogPost,
	generateBlogPostIdeas,
	generateBlogPostSummary,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-blog-post", generateBlogPost);
router.post("/generate-blog-post-ideas", generateBlogPostIdeas);
router.post("/generate-blog-post-summary", generateBlogPostSummary);

export default router;
