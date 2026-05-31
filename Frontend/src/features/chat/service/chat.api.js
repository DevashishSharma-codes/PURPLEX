import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
  // FIX: always include chatId in the body — send null explicitly when it's
  // a new chat so the backend receives the field and can branch on it.
  // Previously, passing chatId=undefined caused axios to silently omit the
  // field entirely, so the backend never knew about an existing chat and
  // created a new one on every single message.
  const response = await api.post("api/chats/message", {
    message,
    chatId: chatId ?? null,   // null = "new chat", string = "existing chat"
  });
  return response.data;
};

export const getChats = async () => {
  const response = await api.get("api/chats");
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`api/chats/messages/${chatId}`);
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`api/chats/delete/${chatId}`);
  return response.data;
};