import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
// import mongoSanitize from "express-mongo-sanitize";

import { connectDB } from "./config/db.js";

import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js";
import statsRouter from "./routes/stats.routes.js";
import aiRouter from "./routes/ai.routes.js";
const app = express();

//middleware for cors error
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

//middleware for security
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				imgSrc: [
					"'self'",
					"data:",
					"http://localhost:5173",
					"http://localhost:5000",
				],
				styleSrc: ["'self'", "'unsafe-inline'"],
				scriptSrc: ["'self'"],
			},
		},
		crossOriginResourcePolicy: { policy: "cross-origin" },
	})
);

// app.use(mongoSanitize());

//db connection
connectDB();

//middlewares
app.use(express.json());

// Serve static files from uploads directory with proper headers
app.use(
	"/uploads",
	express.static(path.join(process.cwd(), "uploads"), {
		maxAge: "1d", // Cache for 1 day
		setHeaders: (res, path) => {
			res.set("Cross-Origin-Resource-Policy", "cross-origin");
			res.set("Access-Control-Allow-Origin", "*");
		},
	})
);

//routes
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/post", postRouter);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/comment", commentRouter);

app.use("/api/v1/stats", statsRouter);

app.use("/api/v1/ai", aiRouter);



//server starts
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});

//error handler middleware
app.use((error, req, res, next) => {
	const statusCode = error.statusCode || 500;
	const message = error.message || "Internal Server Error";
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
