import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		parentComment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},
		depth: {
			type: Number,
			default: 0,
		},
		commentedAt: {
			type: Date,
			default: Date.now,
		},
		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		likes: {
			type: Array,
			default: [],
		},
		numberOfLikes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

//indexs
commentSchema.index({ postId: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ commentedAt: -1 });

//automatically depth of comment
commentSchema.pre("save", async function (next) {
	if (this.parentComment) {
		const parent = await Comment.findById(this.parentComment);
		if (!parent) {
			return next(new Error("Parent comment not found"));
		}
		if (parent.depth >= 4) {
			return next(new Error("Depth limit reached"));
		}
		this.depth = parent.depth + 1;
	} else {
		this.depth = 0;
	}
	next();
});




//auto populate replies and postedBy
const autoPopulateReplies = function (next) {
	this.populate({
		path: "replies",
		populate: {
			path: "userId",
			select: "name email avatar bio role",
		},
	});

	next();
};

commentSchema.pre("find", autoPopulateReplies);
commentSchema.pre("findOne", autoPopulateReplies);
commentSchema.pre("findById", autoPopulateReplies);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
