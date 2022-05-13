import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { stat } from 'fs'

import { RootState } from './store'

interface IMessage {
  body: string
  from: string
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    open: 'main',
    chats: {
      // Aqui são adicionados todos os chatos, o chat main se trata da conversa apenas local daqui
      main: {
        name: 'Chat',
        messages: [
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
          { body: 'bom dia', from: 'uuid-contato' },
        ],
      },
    },
  },
  reducers: {
    setNewConversation: (
      state,
      action: PayloadAction<{
        uid: string
        messages: Array<{ body: string; from: string }>
        name: string
        photoURL?: string
      }>
    ) => {
      const { uid } = action.payload
      state.chats[uid] = action.payload
    },
    newMessage: (state, action: PayloadAction<{ id: string; message: IMessage }>) => {
      const { id, message } = action.payload
      state.chats[id].push(message)
    },
    setChatOpen: (state, action: PayloadAction<string>) => {
      state.open = action.payload
    },
  },
})

// Getters
// const ChatsIdType = Return

const selectChatMessages = function (id: string = 'main') {
  return (state: RootState) => state.chats.chats[id].messages
}

const selectChat = function (id: string = 'main') {
  return (state: RootState) => state.chats.chats[id]
}

const selectAllChat = (state: RootState) => state.chats.chats

const getChatOpen = (state: RootState) => state.chats.open

export { selectChatMessages, selectChat, selectAllChat, getChatOpen }
export const { newMessage, setChatOpen, setNewConversation } = chatsSlice.actions
export default chatsSlice.reducer
