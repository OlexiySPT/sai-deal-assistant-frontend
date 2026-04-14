import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { getCachedStringOptions, StringOptionsQuery } from "./optionsAPI";

interface OptionsState {
  options: string[];
  loading: boolean;
  error: string | null;
}

const initialState: OptionsState = {
  options: [],
  loading: false,
  error: null,
};

export const fetchStringOptions = createAsyncThunk(
  "options/fetchStringOptions",
  async (params: StringOptionsQuery, { rejectWithValue }) => {
    try {
      return await getCachedStringOptions(params);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch string options");
    }
  },
);

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    clearOptions: (state) => {
      state.options = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStringOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStringOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload || [];
      })
      .addCase(fetchStringOptions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch string options";
      });
  },
});

export const { clearOptions } = optionsSlice.actions;
export const selectOptions = (state: RootState) => state.options.options;
export const selectOptionsLoading = (state: RootState) => state.options.loading;
export const selectOptionsError = (state: RootState) => state.options.error;

export default optionsSlice.reducer;
