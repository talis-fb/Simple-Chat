import { createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uuid: '',
    pin: '2131',
    name: '',
    email: '',
    photoProfile: '',
  },
  reducers: {
    updateName: (state, action) => {
      state.name = action.payload
    },
    updatePhotoProfile: (state, action) => {
      state.photoProfile = action.payload
    },
  },
})

const getName = (state: RootState) => state.user.name
const getEmail = (state: RootState) => state.user.email
const getUser = (state: RootState) => state.user

export { getEmail, getName, getUser }
export const { updateName, updatePhotoProfile } = userSlice.actions
export default userSlice.reducer
