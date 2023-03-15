import { AppThunk, RootState } from './store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type isUserLoggedIn = boolean;
type userId = string
type userName = string
type userEmail = string

type userInfo = {
  userInfo: {
    isUserLoggedIn: isUserLoggedIn,
    userId: userId,
    userName: userName,
    userEmail: userEmail,
  }
}

const initialState: userInfo = {
  userInfo: {
    isUserLoggedIn: false,
    userId: '',
    userName: '',
    userEmail: '',
  }
}

export const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    isUserLoggedIn: (state, action: PayloadAction<isUserLoggedIn>) => {
      state.userInfo.isUserLoggedIn = action.payload;
    },
    userName: (state, action: PayloadAction<userName>) => {
      state.userInfo.userName = action.payload;
    }
  }
});

export const { isUserLoggedIn, userName } = chatSlice.actions;
export default chatSlice.reducer;