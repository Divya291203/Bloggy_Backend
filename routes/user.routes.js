import express from "express";
import {
	deleteUser,
	getAllUsers,
	// getUser,
	imageUpload,
	updataUser,
} from "../controllers/user.controller.js";
import { protect, roleCheck } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

//routes
router.get("/all-users", protect, roleCheck(["admin"]), getAllUsers);
// router.get("/my-profile", protect, getUser);
router.delete("/delete", protect, roleCheck(["admin"]), deleteUser);
router.put("/update", protect, updataUser);

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
	if (error) {
		console.error("Multer error:", error);
		if (error.code === "LIMIT_FILE_SIZE") {
			return res
				.status(400)
				.json({ message: "File too large. Maximum size is 5MB." });
		}
		return res.status(400).json({ message: error.message });
	}
	next();
};

router.post(
	"/image-upload",
	upload.single("image"),
	handleMulterError,
	imageUpload
);

export default router;
