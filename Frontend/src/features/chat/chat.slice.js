import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    /**
     * createNewChat
     *
     * KEY FIX: when the chat already exists we only update its title /
     * lastUpdated — we do NOT touch currentChatId.  Unconditionally writing
     * currentChatId here was the slice-level trigger that made Dashboard's
     * sync effect (`useEffect([currentChatId])`) fire on every follow-up,
     * clobbering activeChatIdRef and surfacing as a new sidebar entry.
     *
     * currentChatId is now managed exclusively by:
     *   • setCurrentChatId   (explicit navigation / new-chat flow)
     *   • useChat.js         (only dispatches it for genuinely new chats)
     */
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      if (!state.chats[chatId]) {
        // Genuinely new chat — create entry and activate it.
        state.chats[chatId] = {
          title,
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
        // Only set currentChatId here for brand-new chats; useChat.js also
        // dispatches setCurrentChatId explicitly, so this is a safe belt-and-
        // suspenders assignment that keeps the slice self-consistent.
        state.currentChatId = chatId;
      } else {
        // Existing chat — just refresh metadata, never change currentChatId.
        state.chats[chatId].title = title;
        state.chats[chatId].lastUpdated = new Date().toISOString();
      }
    },

    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].messages.push({ content, role });
        state.chats[chatId].lastUpdated = new Date().toISOString();
      }
    },

    setChats: (state, action) => {
      state.chats = action.payload;
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setIsLoading,
  setError,
  createNewChat,
  addNewMessage,
} = chatSlice.actions;

export default chatSlice.reducer;