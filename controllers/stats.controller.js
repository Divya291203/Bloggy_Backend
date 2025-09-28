import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import Comment from "../models/comment.model.js";
// import Activity from "../models/activity.model.js";

export const totalPosts = async (req, res) => {
	try {
		const totalPublishedPosts = await Post.countDocuments({
			isDraft: false,
		});
		const totalDrafts = await Post.countDocuments({
			isDraft: true,
		});
		const totalPosts = totalPublishedPosts + totalDrafts;

		const totalViews = await Post.aggregate([
			{ $group: { _id: null, totalViews: { $sum: "$views" } } },
		]);
		return res.status(200).json({
			totalPosts,
			totalPublishedPosts,
			totalDrafts,
			totalViews: totalViews[0].totalViews,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const totalUsers = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		return res.status(200).json({ totalUsers });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const totalComments = async (req, res) => {
	try {
		const totalComments = await Comment.countDocuments();
		return res.status(200).json({ totalComments });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const todaysStats = async (req, res) => {
	try {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);
		const publishedPostToday = await Post.countDocuments({
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
			isDraft: false,
		});
		const totalDraftsToday = await Post.countDocuments({
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
			isDraft: true,
		});
		const totalUsersCreatedToday = await User.countDocuments({
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		});
		const totalViewsToday = await Post.aggregate([
			{ $group: { _id: null, totalViews: { $sum: "$views" } } },
		]);

		return res.status(200).json({
			publishedPostToday,
			totalDraftsToday,
			totalUsersCreatedToday,
			totalViewsToday: totalViewsToday[0]?.totalViews || 0,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const weeklyStats = async (req, res) => {
	try {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
		sevenDaysAgo.setHours(0, 0, 0, 0);

		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const publishedPostWeekly = await Post.countDocuments({
			createdAt: { $gte: sevenDaysAgo, $lte: endOfDay },
			isDraft: false,
		});
		const totalDraftsWeekly = await Post.countDocuments({
			createdAt: { $gte: sevenDaysAgo, $lte: endOfDay },
			isDraft: true,
		});
		const totalUsersCreatedWeekly = await User.countDocuments({
			createdAt: { $gte: sevenDaysAgo, $lte: endOfDay },
		});
		const totalViewsWeekly = await Post.aggregate([
			{ $group: { _id: null, totalViews: { $sum: "$views" } } },
		]);
		return res.status(200).json({
			publishedPostWeekly,
			totalDraftsWeekly,
			totalUsersCreatedWeekly,
			totalViewsWeekly: totalViewsWeekly[0]?.totalViews || 0,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const monthlyStats = async (req, res) => {
	try {
		const oneMonthAgo = new Date();
		oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
		oneMonthAgo.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const publishedPostMonthly = await Post.countDocuments({
			createdAt: { $gte: oneMonthAgo, $lte: endOfDay },
			isDraft: false,
		});
		const totalDraftsMonthly = await Post.countDocuments({
			createdAt: { $gte: oneMonthAgo, $lte: endOfDay },
			isDraft: true,
		});
		const totalUsersCreatedMonthly = await User.countDocuments({
			createdAt: { $gte: oneMonthAgo, $lte: endOfDay },
		});
		const totalViewsMonthly = await Post.aggregate([
			{ $group: { _id: null, totalViews: { $sum: "$views" } } },
		]);
		return res.status(200).json({
			publishedPostMonthly,
			totalDraftsMonthly,
			totalUsersCreatedMonthly,
			totalViewsMonthly: totalViewsMonthly[0]?.totalViews || 0,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

// Author Stats
export const totalAuthorPosts = async (req, res) => {
	try {
		const totalPosts = await Post.countDocuments({ userId: req.user.id });
		return res.status(200).json({ totalPosts });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
const CATEGORIES = [
	"Technology",
	"Programming",
	"Web Development",
	"Mobile Development",
	"Design",
	"Business",
	"Marketing",
	"Lifestyle",
	"Anime",
	"Travel",
	"Food",
	"Health",
	"Education",
	"Entertainment",
	"News",
	"Other",
];

// Category Stats
export const categoryStats = async (req, res) => {
	try {
		const categoryStats = [];

		await Promise.all(
			CATEGORIES.map(async (category) => {
				const count = await Post.countDocuments({ category });
				categoryStats.push({ category, count });
			})
		);
		return res.status(200).json({ categoryStats });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
