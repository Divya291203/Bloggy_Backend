import { GoogleGenerativeAI } from "@google/generative-ai";
import {
	blogPostPrompt,
	blogPostIdeaPrompt,
	blogSummaryPrompt,
} from "../utils/prompts.js";

export const generateBlogPost = async (req, res) => {
	const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
	try {
		const { title, tone } = req.body;
		if (!title || !tone) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}
		const model = genAI.getGenerativeModel({
			model: "gemini-2.0-flash",
			generationConfig: {
				responseMimeType: "application/json",
			},
		});
		const prompt = blogPostPrompt(title, tone);
		const result = await model.generateContent(prompt);
		const response = await result.response;
		res.status(200).json(JSON.parse(response.text()));
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const generateBlogPostIdeas = async (req, res) => {
	const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
	try {
		const { topic } = req.body;
		if (!topic) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}
		const model = genAI.getGenerativeModel({
			model: "gemini-2.0-flash",
			generationConfig: {
				responseMimeType: "application/json",
			},
		});
		const prompt = blogPostIdeaPrompt(topic);
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const ideas = JSON.parse(response.text());

		res.status(200).json({
			ideas,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const generateBlogPostSummary = async (req, res) => {
	const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
	try {
		const { content } = req.body;
		if (!content) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}
		const model = genAI.getGenerativeModel({
			model: "gemini-2.0-flash",
			generationConfig: {
				responseMimeType: "application/json",
			},
		});
		const prompt = blogSummaryPrompt(content);
		const result = await model.generateContent(prompt);
		const response = await result.response;
		res.status(200).json(JSON.parse(response.text()));
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
