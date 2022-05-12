import { createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    pin: '',
    name: '',
    email: '',
    photoURL: '',
  },
  reducers: {
    updateName: (state, action) => {
      state.name = action.payload
    },
    updatePhotoProfile: (state, action) => {
      state.photoURL = action.payload
    },
    updateUser: (state, action) => {
      state.uid = action.payload.uid
      state.pin = action.payload.pin
      state.name = action.payload.name
      state.email = action.payload.email
      state.photoURL = action.payload.photoURL
    },
  },
})

const getName = (state: RootState) => state.user.name
const getEmail = (state: RootState) => state.user.email
const getUser = (state: RootState) => state.user

export { getEmail, getName, getUser }
export const { updateName, updatePhotoProfile, updateUser } = userSlice.actions
export default userSlice.reducer
