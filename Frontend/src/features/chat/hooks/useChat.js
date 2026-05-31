import { initializeSocketConnection } from "../service/chat.socket.js";
import { sendMessage } from "../service/chat.api.js";
import { useDispatch } from "react-redux";
import {
  setCurrentChatId,
  setIsLoading,
  createNewChat,
  addNewMessage,
} from "../chat.slice.js";

/**
 * normaliseResponse
 *
 * Backend always returns this exact shape:
 * {
 *   success: true,
 *   title:   "...",
 *   chat:    { _id, title, user, createdAt, updatedAt },
 *   message: { content, role, chat, _id, ... }
 * }
 *
 * So: aiContent = data.message.content
 *     chat      = data.chat
 */
function normaliseResponse(data) {
  console.log("[useChat] raw response →", data);

  const chat = data?.chat ?? null;

  // Primary: message.content  (confirmed from network tab)
  // Fallbacks kept for safety in case backend shape ever changes
  const aiContent =
    data?.message?.content ??
    data?.aiMessage?.content ??
    (typeof data?.message  === "string" ? data.message  : undefined) ??
    (typeof data?.response === "string" ? data.response : undefined) ??
    (typeof data?.reply    === "string" ? data.reply    : undefined) ??
    (Array.isArray(data?.messages)
      ? data.messages[data.messages.length - 1]?.content
      : undefined) ??
    "";

  console.log("[useChat] resolved chat:", chat);
  console.log("[useChat] resolved aiContent length:", aiContent.length);

  return { chat, aiContent: String(aiContent) };
}

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    dispatch(setIsLoading(true));
    try {
      const raw = await sendMessage({ message, chatId });
      const { chat, aiContent } = normaliseResponse(raw);

      if (!chat?._id) {
        console.error("[useChat] Missing chat._id — full response:", JSON.stringify(raw, null, 2));
        throw new Error("API response missing chat._id");
      }

      if (!aiContent) {
        console.warn("[useChat] aiContent is empty — full response:", JSON.stringify(raw, null, 2));
      }

      // Only register as a new chat + update currentChatId when the server
      // returned a different _id than what we sent (i.e. genuinely new chat).
      // For follow-ups the server echoes the same _id → skip setCurrentChatId
      // so the sidebar never grows a phantom entry.
      const isNewChat = !chatId || chatId !== chat._id;

      if (isNewChat) {
        dispatch(createNewChat({ chatId: chat._id, title: chat.title ?? "New search" }));
        dispatch(setCurrentChatId(chat._id));
      } else {
        // Refresh title/timestamp only — never touch currentChatId
        dispatch(createNewChat({ chatId: chat._id, title: chat.title ?? "New search" }));
      }

      dispatch(addNewMessage({ chatId: chat._id, content: message,   role: "user" }));
      dispatch(addNewMessage({ chatId: chat._id, content: aiContent, role: "ai"   }));

      return { chat, aiContent };
    } catch (err) {
      console.error("[useChat] handleSendMessage error:", err);
      throw err;
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  return { initializeSocketConnection, handleSendMessage };
};