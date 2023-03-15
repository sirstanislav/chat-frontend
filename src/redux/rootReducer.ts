import { chatApi } from "./chatApi";
import chatSlice from "./chatSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  [chatApi.reducerPath]: chatApi.reducer,
  chatSlice: chatSlice,
});

export default rootReducer;