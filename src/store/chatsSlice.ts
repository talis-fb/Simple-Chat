import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from './store'

interface IMessage {
  body: string
  from: string
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    root: {
      // Aqui são adicionados todos os chatos, o chat main se trata da conversa apenas local daqui
      main: {
        messages: [{ body: 'bom dia', from: 'uuid-contato' }],
      },
    },
  },
  reducers: {
    newMessage: (state, action: PayloadAction<{ id: string; message: IMessage }>) => {
      const { id, message } = action.payload
      state.root[id].push(message)
    },
  },
})

// Getters
// const ChatsIdType = Return

const selectChatMessages = function (id: string = 'main') {
  return (state: RootState) => state.chats.root[id].messages
}

const selectChat = function (id: string = 'main') {
  return (state: RootState) => state.chats.root[id]
}

export { selectChatMessages, selectChat }
export const { newMessage } = chatsSlice.actions
export default chatsSlice.reducer
