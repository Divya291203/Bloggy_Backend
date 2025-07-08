import express from "express";
import {
	totalPosts,
	totalUsers,
	totalComments,
	publishedToday,
	totalAuthorPosts,
	categoryStats,
	// recentActivities,
} from "../controllers/stats.controller.js";
import { protect, roleCheck } from "./../middlewares/authMiddleware.js";
const router = express.Router();

// Admin Stats
router.get("/total-posts", protect, roleCheck(["admin"]), totalPosts);
router.get("/total-users", protect, roleCheck(["admin"]), totalUsers);
router.get("/total-comments", protect, roleCheck(["admin"]), totalComments);
router.get("/published-today", protect, roleCheck(["admin"]), publishedToday);
// router.get(
// 	"/recent-activities",
// 	protect,
// 	roleCheck(["admin"]),
// 	recentActivities
// );
// router.get("/recent-activities", recentActivities);

// Author Stats
router.get(
	"/author-total-posts",
	protect,
	roleCheck(["author"]),
	totalAuthorPosts
);

// Topic Stats
router.get("/category-stats", categoryStats);

export default router;
