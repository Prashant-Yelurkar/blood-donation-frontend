// app/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: null,
    role: null,
    area:null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.user.id = action.payload.id;
      state.user.role = action.payload.role;
      state.user.area = action.payload.area;
    },

    resetUserProfile: (state) => {
      state.user = {
        id: null,
        role: null,
        area:null,
      };
    },
  },
});

export const { setUserProfile, resetUserProfile } = userSlice.actions;
export default userSlice.reducer;
