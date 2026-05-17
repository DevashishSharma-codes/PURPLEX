import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";


export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  let chat = null, title = null;
  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title: title,
    });
  }

  const resolvedChatId = chatId || chat._id; // ✅ resolve once, use everywhere

  const userMessage = await messageModel.create({
    chat: resolvedChatId,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: resolvedChatId });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: resolvedChatId,
    content: result,
    role: "ai",
  });

  return res.status(200).json({
    success: true,
    title: title,
    chat: chat,
    message: aiMessage,
  });
};