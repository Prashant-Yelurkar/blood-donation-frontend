// app/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    event:{
            id: null,
        canCall: false,
        canAcceptAttendance: false,
    }
};

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        setEventPermission: (state, action) => {
            console.log(action);
            
            state.event.id = action.payload.id;
            state.event.canCall = action.payload.canCall;
            state.event.canAcceptAttendance = action.payload.canAcceptAttendance;
        },
        resetAuth: (state) => {
            state.event.id = null;
                state.event.eventcanCall = false;
                state.event.canAcceptAttendance = false;
        }
    },
});

export const { setEventPermission, resetAuth } = eventSlice.actions;
export default eventSlice.reducer;
