import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default:
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw06L9hLqVlVreNs9O-DYUeZ&ust=1706089977038000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNj29sqe84MDFQAAAAAdAAAAABAD",
		},
		role: {
			type: String,
			enum: ["admin", "reader", "author"],
			default: "reader",
		},
		bio: {
			type: String,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		try {
			const hashedPassword = await bcrypt.hash(this.password, 10);
			this.password = hashedPassword;
			next();
		} catch (error) {
			next(error);
		}
	} else {
		next();
	}
});

userSchema.methods.comparePassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		next(error);
	}
};

const User = mongoose.model("User", userSchema);

export default User;
