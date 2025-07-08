import Comment from "../models/comment.model.js";

//delete comment with children
const deleteCommentWithChildren = async (commentId) => {
	const comment = await Comment.findById(commentId);
	if (!comment) {
		return;
	}
	await Promise.all(
		comment.replies.map((replyId) => deleteCommentWithChildren(replyId))
	);

	await Comment.deleteOne({ _id: commentId });
};

export const createComment = async (req, res) => {
	try {
		const { content, postId } = req.body;

		const newComment = await Comment({
			content,
			postId,
			userId: req.user.id,
		});

		await newComment.save();
		res.status(200).json({ message: "Comment created successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
export const getPostComments = async (req, res) => {
	try {
		const id = req.params.id;
		const comments = await Comment.find({
			postId: id,
			parentComment: null,
		})
			.populate("userId", "name email avatar bio role")
			.sort({ createdAt: -1 });
		res.status(200).json({
			message: "successfully fetched all the comment for the post",
			comments,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
export const deleteComment = async (req, res) => {
	try {
		const id = req.body.id;
		const comment = await Comment.findById(id);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		if (comment.userId != req.user.id && req.user.role != "admin") {
			return res
				.status(403)
				.json({ message: "You are not allowed to delete this comment" });
		}

		await deleteCommentWithChildren(comment._id);
		res.status(200).json({ message: "Comment has been deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
export const editComment = async (req, res) => {
	try {
		const id = req.body.id;
		const comment = await Comment.findById(id);
		if (!comment) {
			res.status(404).json({ message: "Comment not found" });
		}
		if (comment.userId != req.user.id && req.user.role != "admin") {
			res.status(403).json({ message: "not allowed to edit this comment" });
		}
		comment.content = req.body.content || comment.content;
		const newComment = await comment.save();
		res
			.status(200)
			.json({ message: "comment updated successfully", newComment });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
export const likeComments = async (req, res) => {
	try {
		const id = req.body.id;
		const comment = await Comment.findById(id);
		if (!comment) {
			res.status(404).json({ message: "comment not found" });
		}

		if (comment.likes.includes(req.user.id)) {
			const index = comment.likes.indexOf(req.user.id);
			comment.numberOfLikes -= 1;
			comment.likes.splice(index, 1);
		} else {
			comment.numberOfLikes += 1;
			comment.likes.push(req.user.id);
		}
		const newComment = await comment.save();
		const totalLikes = newComment.numberOfLikes;

		res.status(200).json({ message: "Likes has been updated", totalLikes });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const getComments = async (req, res) => {
	try {
		const { page = 1, limit = 10, order = "desc" } = req.query;

		const skip = (Number(page) - 1) * Number(limit);
		const sortDirection = order === "desc" ? -1 : 1;

		const comment = await Comment.find()
			.populate("userId", "name email avatar bio role")
			.populate("postId", "title slug")
			.sort({ createdAt: Number(sortDirection) })
			.skip(skip)
			.limit(Number(limit));

		const totalComments = await Comment.countDocuments();
		res.status(200).json({
			comment,
			totalComments,
			currentPage: Number(page),
			totalPages: Math.ceil(totalComments / limit),
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const reply = async (req, res) => {
	try {
		const { postId, commentId, content } = req.body;
		const newReply = await Comment({
			content,
			postId,
			userId: req.user.id,
			parentComment: commentId,
		});
		const savedReply = await newReply.save();
		await Comment.findOneAndUpdate(
			{ _id: commentId, postId },
			{ $push: { replies: savedReply._id } }
		);
		res.status(200).json({ message: "Reply has been created successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
