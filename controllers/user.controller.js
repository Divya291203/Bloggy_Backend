import User from "../models/User.model.js";

//get user
export const getUser = async (req, res) => {
	try {
		const id = req.user.id;
		const user = await User.findById(id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({ message: "User found", user });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//get all user
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password");
		if (!users) {
			return res.status(404).json({ message: "No user found" });
		}
		res.status(200).json({ message: "Users found successfully", users });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//delete user by id
export const deleteUser = async (req, res) => {
	try {
		const userWillBeDeleted = req.body.id;
		const user = await User.findById(userWillBeDeleted);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (user.role === "admin" || req.user.id == userWillBeDeleted) {
			await user.deleteOne();
		} else {
			return res
				.status(403)
				.json({ message: "You are not allowed to delete this user" });
		}
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//update user
export const updataUser = async (req, res) => {
	try {
		const id = req.body.id;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (req.user.id != id) {
			return res.status(403).json({ message: "Not allowed" });
		}
		// //TODO: update better sanitation of given data for update

		const { name, email, password, avatar, bio } = req.body;

		user.name = name ?? user.name;
		user.email = email ?? user.email;
		user.password = password ?? user.password;
		user.avatar = avatar ?? user.avatar;
		user.bio = bio ?? user.bio;

		const updatedUser = await user.save();
		res
			.status(200)
			.json({ message: "User has been updated successfullly", updatedUser });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Errorrrr", error: error.message });
	}
};

//image upload
export const imageUpload = async (req, res) => {
	try {
		console.log("req.file", req.file);
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
			req.file.filename
		}`;

		res
			.status(200)
			.json({ message: "File uploaded successfully", url: imageUrl });
	} catch (error) {
		res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
