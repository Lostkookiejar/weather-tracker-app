import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getCurrentWeather = createAsyncThunk(
  "weather/getCurrentWeather",
  async (position) => {
    const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;
    const { lat, lng } = position;

    const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${mapsApiKey}&location.latitude=${lat}&location.longitude=${lng}&days=1`;
    const response = await fetch(url);

    return await response.json();
  },
);

export const currentWeatherSlice = createSlice({
  name: "currentWeather",
  initialState: {
    value: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    (builder.addCase(getCurrentWeather.fulfilled, (state, action) => {
      state.value = action.payload;
      state.loading = false;
    }),
      builder.addCase(getCurrentWeather.pending, (state) => {
        state.loading = true;
      }));
  },
});

export default currentWeatherSlice.reducer;
