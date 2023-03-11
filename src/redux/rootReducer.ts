import { combineReducers } from "@reduxjs/toolkit";
import { chatApi } from "./chatApi";
import chatSlice from "./chatSlice";

const rootReducer = combineReducers({
  [chatApi.reducerPath]: chatApi.reducer,
  chatSlice: chatSlice,
});

export default rootReducer;