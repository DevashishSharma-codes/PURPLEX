import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const getModel = () => new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateResponse = async (prompt) => {
  const model = getModel();
  const response = await model.invoke(prompt);
  return response.text;
};