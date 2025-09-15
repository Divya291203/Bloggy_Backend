import { GoogleGenAI } from "@google/genai";
import { blogPostPrompt, blogPostIdeaPrompt, blogSummaryPrompt } from "../utils/prompts.js";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const generateBlogPost = async (req, res) => {
	try {
		const { title, tone } = req.body;
		if (!title || !tone) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}
		const prompt = blogPostPrompt(title, tone);
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash-lite",
			contents: prompt,
			config: {
				responseMimeType: "application/json",
			},
		});
		res.status(200).json(response.response.json);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const generateBlogPostIdeas = async (req, res) => {
	try {
		const { topic } = req.body;
		if (!topic) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}
		const prompt = blogPostIdeaPrompt(topic);
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash-lite",
			contents: prompt,
			config: {
				responseMimeType: "application/json",
			},
		});
		res.status(200).json(response.response.json);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const generateBlogPostSummary = async (req, res) => {
	try {
		const { content } = req.body;
		if (!content) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}
		const prompt = blogSummaryPrompt(content);
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash-lite",
			contents: prompt,
			config: {
				responseMimeType: "application/json",
			},
		});
		res.status(200).json(response.response.json);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};
