import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';

const initialState = {}

export const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    users: (state, action: PayloadAction<[]>) => {
      state = action.payload;
    }
  }
});

export const { users } = chatSlice.actions;
export default chatSlice.reducer;