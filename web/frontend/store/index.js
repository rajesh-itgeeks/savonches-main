// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import storeReducer from './storeSlice';

const store = configureStore({
  reducer: {
    store: storeReducer,
  },
});

export default store;
