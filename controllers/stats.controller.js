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
		res.status(200).json({
			totalPosts,
			totalPublishedPosts,
			totalDrafts,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const totalUsers = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		res.status(200).json({ totalUsers });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const totalComments = async (req, res) => {
	try {
		const totalComments = await Comment.countDocuments();
		res.status(200).json({ totalComments });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const publishedToday = async (req, res) => {
	try {
		const publishedToday = await Post.countDocuments({
			createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
			isDraft: false,
		});
		res.status(200).json({ publishedToday });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

// export const recentActivities = async (req, res) => {
// 	try {
// 		const recentActivities = await Post.find()
// 			.sort({ createdAt: -1 })
// 			.limit(5);
// 		res.status(200).json({ recentActivities });
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.json({ message: "Internal Server Error", error: error.message });
// 	}
// };
// 		res.status(200).json({ recentActivities });
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.json({ message: "Internal Server Error", error: error.message });
// 	}
// };

// Author Stats
export const totalAuthorPosts = async (req, res) => {
	try {
		const totalPosts = await Post.countDocuments({ userId: req.user.id });
		res.status(200).json({ totalPosts });
	} catch (error) {
		res
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
		res.status(200).json({ categoryStats });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
