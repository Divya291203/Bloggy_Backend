import Post from "../models/Post.model.js";
import slugCreator from "../utils/slug.js";
import { POST_SORT_BY } from "../utils/enums.js";

//create a new post
export const createPost = async (req, res) => {
	try {
		const { content, title } = req.body;

		if (!content || !title) {
			return res
				.status(400)
				.json({ message: "Please Proveid all required fields" });
		}
		const slug = slugCreator(req.body.title);

		const newPost = new Post({
			...req.body,
			slug,
			userId: req.user.id,
		});
		const savePost = await newPost.save();
		res.status(200).json(savePost);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//get all post by filter
export const getPosts = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 10,
			search = "",
			category,
			sortBy = POST_SORT_BY.NEWEST,
		} = req.query;

		let sortOptions = {};
		let query = {};
		if (sortBy === POST_SORT_BY.OLDEST) {
			sortOptions.createdAt = 1;
		} else if (sortBy === POST_SORT_BY.TITLE) {
			sortOptions.title = 1;
		} else if (sortBy === POST_SORT_BY.VIEWS) {
			sortOptions.views = -1;
		} else {
			sortOptions.createdAt = -1;
		}

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ content: { $regex: search, $options: "i" } },
			];
		}

		if (category) {
			query.category = category;
		}

		query.isDraft = false;

		const skip = (Number(page) - 1) * Number(limit);

		const posts = await Post.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(Number(limit))
			.populate("userId", "name email avatar bio role");

		const totalPosts = await Post.countDocuments(query);

		res.status(200).json({
			posts,
			totalPosts,
			currentPage: Number(page),
			totalPages: Math.ceil(totalPosts / limit),
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//get post by id
export const getPostById = async (req, res) => {
	const postId = req.params.id;
	try {
		const post = await Post.findById(postId).populate(
			"userId",
			"name email avatar bio role"
		);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		//increment the views
		post.views++;
		await post.save();

		res.status(200).json({ message: "Post fetched successfully", post });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//delete a post by postid
export const deletePost = async (req, res) => {
	try {
		const requestUserId = req.user.id;
		const postId = req.body.id;

		if (req.user.role === "admin") {
			await Post.findByIdAndDelete(postId);
			res.status(200).json({ message: "Post has been deleted successfully" });
		} else {
			const post = await Post.findById(postId);
			const authorId = post.userId;
			if (authorId == requestUserId) {
				await post.deleteOne();
				res.status(200).json({ message: "Post has been deleted successfully" });
			} else {
				res
					.status(403)
					.json({ message: "You are not the author of this post" });
			}
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

//update a post by postid
export const updatePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (req.user.id !== post.userId) {
			return res
				.status(403)
				.json({ message: "You are not the author of this post" });
		}

		post.title = req.body.title ?? post.title;
		post.content = req.body.content ?? post.content;
		post.image = req.body.image ?? post.image;
		post.category = req.body.category ?? post.category;
		post.isDraft = req.body.isDraft ?? post.isDraft;

		if (req.body.title) {
			post.slug = slugCreator(req.body.title);
		}
		const updatedPost = await post.save();
		res
			.status(200)
			.json({ message: "Post has been updated successfully", updatedPost });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//get all drafts
export const getDrafts = async (req, res) => {
	try {
		const drafts = await Post.find({ userId: req.user.id, isDraft: true });
		res.status(200).json({ message: "Drafts fetched successfully", drafts });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//get all my posts
export const getMyPosts = async (req, res) => {
	try {
		const posts = await Post.find({ userId: req.user.id, isDraft: false });
		res.status(200).json({ message: "My posts fetched successfully", posts });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
