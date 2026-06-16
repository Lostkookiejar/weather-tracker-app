import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../features/locationSlice";
import currentWeatherReducer from "../features/currentWeatherSlice";

export default configureStore({
  reducer: { location: locationReducer, currentWeather: currentWeatherReducer },
});
