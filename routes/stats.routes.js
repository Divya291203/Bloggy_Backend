import express from "express";
import {
	totalPosts,
	totalUsers,
	totalComments,
	todaysStats,
	totalAuthorPosts,
	categoryStats,
	weeklyStats,
	monthlyStats,
	// recentActivities,
} from "../controllers/stats.controller.js";
import { protect, roleCheck } from "./../middlewares/authMiddleware.js";
const router = express.Router();

// Admin Stats
router.get("/total-posts", protect, roleCheck(["admin"]), totalPosts);
router.get("/total-users", protect, roleCheck(["admin"]), totalUsers);
router.get("/total-comments", protect, roleCheck(["admin"]), totalComments);
router.get("/todays-stats", protect, roleCheck(["admin"]), todaysStats);
router.get("/weekly-stats", protect, roleCheck(["admin"]), weeklyStats);
router.get("/monthly-stats", protect, roleCheck(["admin"]), monthlyStats);
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
