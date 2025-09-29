import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
	try {
		let token = req.headers.authorization;
		//Authorization: ["Bearer", "fashfdsajhsdfl"]
		if (token && token.startsWith("Bearer")) {
			token = token.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} else {
			return res.status(401).json({ message: "Not authorized" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const roleCheck = (allowedRoles) => {
	return (req, res, next) => {
		const role = req.user.role;
		if (allowedRoles.includes(role)) {
			next();
		} else {
			return res.status(401).json({ message: "Not authorized" });
		}
	};
};
