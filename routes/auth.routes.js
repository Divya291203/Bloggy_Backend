import express from "express";
import {
	loginUser,
	registerUser,
	signout,
	getUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/signout", protect, signout);
router.get("/me", protect, getUser);

export default router;
