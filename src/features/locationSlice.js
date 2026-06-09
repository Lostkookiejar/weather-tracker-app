import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    value: {
      lat: 0,
      lng: 0,
    },
  },
  reducers: {
    getCurrentPosition: (state, action) => {
      state.value = {
        lat: action.payload.lat,
        lng: action.payload.lng,
      };
      console.log(state.value);
    },
  },
});

export const { getCurrentPosition } = locationSlice.actions;
export default locationSlice.reducer;
