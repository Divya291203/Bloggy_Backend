import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

//generate jwt token
export const generateToken = (id) => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	return token;
};

//create new user
export const registerUser = async (req, res) => {
	try {
		const { name, email, password, avatar, role } = req.body;
		//data validation
		if (!name || !email || !password || !role || !avatar) {
			return res.status(401).json({ message: "Enter all details" });
		}

		//user validation
		const userExist = await User.findOne({ email });
		if (userExist) {
			return res.status(400).json({ message: "User Already Exist" });
		}

		const user = await User.create({
			name,
			email,
			password,
			avatar,
			role,
		});
		const token = generateToken(user._id);
		res
			.status(200)
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				role: user.role,
				token,
			});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

//login user
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		//validating inputes
		if (!email || !password) {
			return res.status(400).json({ message: "Email or password is required" });
		}

		//validating user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// compare password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: "Incorrect Credentials" });
		}

		const token = generateToken(user._id);
		res
			.status(200)
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				role: user.role,
				token,
			});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

//signout
export const signout = async (req, res) => {
	try {
		res
			.clearCookie("access_token")
			.status(200)
			.json({ message: "User signout successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

//get me
export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};
