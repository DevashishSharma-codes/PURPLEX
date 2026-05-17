import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage , AIMessage } from "@langchain/core/messages";

// ── Model Initialization ────────────────────────────────────────────────────

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// ── System Prompts ──────────────────────────────────────────────────────────

const PURPLEX_SYSTEM_PROMPT = `You are Purplex, an advanced AI-powered research assistant designed to deliver precise, well-structured, and insightful answers.

Your core principles:
- Provide accurate, up-to-date, and comprehensive responses
- Structure information clearly using markdown when appropriate
- Cite reasoning transparently and acknowledge uncertainty when it exists
- Adapt tone and depth to match the complexity of the query
- Prioritize clarity, brevity, and usefulness in every response

You are not a generic chatbot — you are a research-grade assistant built to help users deeply understand any topic.`;

const TITLE_GENERATION_PROMPT = `You are a titling assistant for Purplex, an AI research application.

Your sole task is to generate a concise, descriptive title for a given conversation.

Rules:
- Length: 2–5 words only
- Capture the core topic or intent of the conversation
- Use title case
- No punctuation, quotes, or filler words
- Output only the title — nothing else`;

// ── Service Functions ───────────────────────────────────────────────────────

/**
 * Generates a research-grade response to a user query using Gemini.
 * @param {string} message - The user's input message.
 * @returns {Promise<string>} The AI-generated response.
 */
export const generateResponse = async (messages) => {
  const response = await geminiModel.invoke([
    new SystemMessage(PURPLEX_SYSTEM_PROMPT),
    ...messages.map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    ),
  ]);

  return response.content;
};

/**
 * Generates a short, descriptive title for a chat conversation using Mistral.
 * @param {string} message - The initial user message or conversation excerpt.
 * @returns {Promise<string>} A 2–5 word title summarizing the conversation.
 */
export const generateChatTitle = async (message) => {
  const response = await mistralModel.invoke([
    new SystemMessage(TITLE_GENERATION_PROMPT),
    new HumanMessage(`Conversation: ${message}`),
  ]);

  return response.content;
};