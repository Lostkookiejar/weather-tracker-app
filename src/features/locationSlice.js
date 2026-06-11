import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    value: {},
  },
  reducers: {
    getCurrentPosition: (state, action) => {
      state.value = {
        lat: action.payload.lat,
        lng: action.payload.lng,
      };
    },
  },
});

export const { getCurrentPosition } = locationSlice.actions;
export default locationSlice.reducer;
