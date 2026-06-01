import dotenv from "dotenv";
dotenv.config();

import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { searchInternet } from "./internet.service.js";

// ── Models ──────────────────────────────────────────────────────────────────
// Primary: Mistral (free tier is generous — 1 req/s, no daily cap on small)
// Titles:  Mistral small (cheap & fast)

const chatModel = new ChatMistralAI({
  model: "mistral-large-latest", // smarter model for main responses
  apiKey: process.env.MISTRAL_API_KEY,
});

const titleModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// ── In-flight dedup guard ───────────────────────────────────────────────────

const inFlight = new Map();

// ── System Prompts ──────────────────────────────────────────────────────────

const buildSystemPrompt = (searchResults = null) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const searchSection = searchResults
    ? `\nLIVE SEARCH RESULTS (use these as your primary source of truth):\n${searchResults}\n`
    : "";

  return `You are Purplex, an advanced AI-powered research assistant — similar to Perplexity AI.

TODAY'S DATE: ${today}
${searchSection}
RULES:
- If search results are provided above, base your answer STRICTLY on them. Do not use training data for facts.
- If a "Tavily Summary Answer" is present in the results, prioritize it as ground truth.
- Always mention the source or date when answering news or sports queries.
- Never fabricate scores, outcomes, or facts.
- Today is June 01, 2026. REJECT any search results dated before 2026 for current events queries.
- Structure your response clearly using markdown when appropriate.
- Be concise, accurate, and helpful.`;
};

const TITLE_GENERATION_PROMPT = `You are a titling assistant for Purplex, an AI research application.

Your sole task is to generate a concise, descriptive title for a given conversation.

Rules:
- Length: 2–5 words only
- Capture the core topic or intent of the conversation
- Use title case
- No punctuation, quotes, or filler words
- Output only the title — nothing else`;

// ── Query Classifier ────────────────────────────────────────────────────────

const needsSearch = (userMessage) => {
  const msg = userMessage.toLowerCase();

  const searchTriggers = [
    "today", "yesterday", "tonight", "this week", "this month", "this year",
    "right now", "currently", "latest", "recent", "just", "now", "live",
    "upcoming", "scheduled", "next",
    "news", "score", "result", "match", "game", "winner", "won", "lost",
    "beat", "defeated", "final", "standings", "ranking", "tournament",
    "ipl", "nfl", "nba", "fifa", "cricket", "football", "match",
    "price", "stock", "market", "crypto", "bitcoin", "rate", "weather",
    "who is", "what is", "when is", "where is", "happened", "update",
    "launched", "released", "announced",
  ];

  return searchTriggers.some((trigger) => msg.includes(trigger));
};

// ── Main Response Function ──────────────────────────────────────────────────

const TOTAL_BUDGET_MS = 30_000;
const SEARCH_BUDGET_MS = 8_000;

export const generateResponse = async (messages) => {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const requestKey = lastUserMessage?.content?.trim() ?? "unknown";

  // Dedup — if same message already in flight, reuse that promise
  if (inFlight.has(requestKey)) {
    console.log("⚡ Deduped request:", requestKey);
    return inFlight.get(requestKey);
  }

  const promise = (async () => {
    const startedAt = Date.now();

    try {
      let searchResults = null;

      // Step 1: Search if needed
      if (lastUserMessage && needsSearch(lastUserMessage.content)) {
        console.log("🔍 Searching for:", lastUserMessage.content);
        try {
          searchResults = await Promise.race([
            searchInternet({ query: lastUserMessage.content }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Search timed out")), SEARCH_BUDGET_MS)
            ),
          ]);
        } catch (searchError) {
          console.warn("⚠️ Search skipped:", searchError.message);
        }
      }

      const elapsed = Date.now() - startedAt;
      const llmBudget = Math.max(TOTAL_BUDGET_MS - elapsed, 8_000);
      console.log(`⏱ Search took ${elapsed}ms — LLM budget: ${llmBudget}ms`);

      // Step 2: Build messages for Mistral
      const systemPrompt = buildSystemPrompt(searchResults);
      console.log(`📨 System prompt size: ${systemPrompt.length} chars`);

      const formattedMessages = [
        new SystemMessage(systemPrompt),
        ...messages.map((msg) => {
          if (msg.role === "user")      return new HumanMessage(msg.content);
          if (msg.role === "assistant") return new AIMessage(msg.content);
          if (msg.role === "system")    return new SystemMessage(msg.content);
        }).filter(Boolean),
      ];

      // Step 3: Call Mistral with timeout
      console.log("🤖 Calling mistral-large-latest...");
      const response = await Promise.race([
        chatModel.invoke(formattedMessages),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("LLM timed out")), llmBudget)
        ),
      ]);

      console.log("✅ Response from Mistral");
      return response.content;
    } catch (error) {
      console.error("❌ Error in generateResponse:", error.message);

      if (error.message?.includes("timed out")) {
        return "Request timed out. Please try again.";
      }

      return "Something went wrong while generating a response. Please try again.";
    } finally {
      inFlight.delete(requestKey);
    }
  })();

  inFlight.set(requestKey, promise);
  return promise;
};

// ── Title Generator ─────────────────────────────────────────────────────────

export const generateChatTitle = async (message) => {
  try {
    const response = await titleModel.invoke([
      new SystemMessage(TITLE_GENERATION_PROMPT),
      new HumanMessage(`Conversation: ${message}`),
    ]);

    return response.content;
  } catch (error) {
    console.error("❌ Error generating title:", error);
    return "Untitled Chat";
  }
};