import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {});
		console.log("Mongo DB connected");
	} catch (error) {
		console.error("Error occur while connecting to DB", error);
		process.exit(1);
	}
};

export { connectDB };
