// app/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setVerified: (state, action) => {      
      state.isVerified = action.payload; 
    },
    resetAuth: (state) => {
      state.isVerified = false;
    },
  },
});

export const { setVerified, resetAuth } = authSlice.actions;
export default authSlice.reducer;
