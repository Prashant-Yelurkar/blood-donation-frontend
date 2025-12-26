// app/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    email: null,
    id: null,
    name: null,
    profile: null,
    role: null,
    isDeviceVerified:null,
    designation:null,
    deptId:null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.user.email = action.payload.email;
      state.user.id = action.payload.id;
      state.user.name = action.payload.name;
      state.user.profile = action.payload.profile;
      state.user.role = action.payload.role;
      state.user.isDeviceVerified = action.payload.isDeviceVerified
      state.user.designation = action.payload.designation
      state.user.deptId = action.payload.deptId
    },

    resetUserProfile: (state) => {
      state.user = {
        email: null,
        id: null,
        name: null,
        profile: null,
        role: null,
        isDeviceVerified:null,
        deptId:null,
        designation:null,
      };
    },
  },
});

export const { setUserProfile, resetUserProfile } = userSlice.actions;
export default userSlice.reducer;
