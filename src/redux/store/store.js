import { configureStore, createSlice } from '@reduxjs/toolkit';

const restaurantsSlice = createSlice({
  name: 'totalRestaurants',
  initialState: [],
  reducers: {
    setTotalRestaurants: (state, action) => {
      return action.payload;
    },
  },
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState: [],
  reducers: {
    setReports: (state, action) => {
      return action.payload;
    },
  },
});

export const { setTotalRestaurants } = restaurantsSlice.actions;
export const { setReports } = reportsSlice.actions;

export const store = configureStore({
  reducer: {
    totalRestaurants: restaurantsSlice.reducer,
    reports: reportsSlice.reducer,
  },
});