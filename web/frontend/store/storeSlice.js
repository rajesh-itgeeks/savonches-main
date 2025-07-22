// src/store/storeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIServices from '../services/ApiServices';
const APIServ=new APIServices();
// Async thunk to fetch store data only
export const fetchStoreData = createAsyncThunk(
  'store/fetchStoreData',
  async (_, { rejectWithValue }) => {
    try {
      const storeResponse = await APIServ.getStoreData();
      console.log("---------storeapiiiredux",storeResponse);
      if (storeResponse.status) {
        return storeResponse;
      } else {
        return rejectWithValue('Failed to fetch store data: ' + storeResponse.message);
      }
    } catch (error) {
      return rejectWithValue('Error fetching store data: ' + error.message);
    }
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    storeData: null,
    isLoading: false,
    error: null,
    hasFetched: false, // ✅ critical flag
  },
  reducers: {
    resetStoreData: (state) => {
      state.storeData = null;
      state.error = null;
      state.isLoading = false;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStoreData.fulfilled, (state, action) => {
        state.storeData = action.payload;
        state.hasFetched = true; // ✅ mark it as fetched
        state.isLoading = false;
      })
      .addCase(fetchStoreData.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.hasFetched = false;
      });
  },
});


export default storeSlice.reducer;
