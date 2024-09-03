import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectedChatF: (state, action) => {
      const { selectedChat } = action.payload;
      state.selectedChat = selectedChat;
    },
    chatsF: (state, action) => {
      state.chats.push(action.payload);
    },
  },
});

export const { selectedChatF, chatsF } = chatSlice.actions;
export default chatSlice.reducer;
