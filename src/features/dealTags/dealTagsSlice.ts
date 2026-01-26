import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as dealTagsAPI from "./dealTagsAPI";
import type { DealTagDto, AddDealTagIfNotExistsCommand } from "./dealTagsAPI";

// State interface
interface DealTagsState {
  dealTags: DealTagDto[];
  existingTags: string[];
  loading: boolean;
  error: string | null;
}

const initialState: DealTagsState = {
  dealTags: [],
  existingTags: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchDealTags = createAsyncThunk(
  "dealTags/fetchDealTags",
  async (dealId?: number) => {
    return await dealTagsAPI.getDealTags(dealId);
  }
);

export const fetchExistingTags = createAsyncThunk(
  "dealTags/fetchExistingTags",
  async () => {
    return await dealTagsAPI.getExistingTags();
  }
);

export const addDealTag = createAsyncThunk(
  "dealTags/addDealTag",
  async (data: AddDealTagIfNotExistsCommand) => {
    return await dealTagsAPI.addDealTag(data);
  }
);

export const deleteDealTag = createAsyncThunk(
  "dealTags/deleteDealTag",
  async (id: number) => {
    return await dealTagsAPI.deleteDealTag(id);
  }
);

// Slice
const dealTagsSlice = createSlice({
  name: "dealTags",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch deal tags
      .addCase(fetchDealTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealTags.fulfilled, (state, action) => {
        state.loading = false;
        state.dealTags = action.payload;
      })
      .addCase(fetchDealTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch deal tags";
      })
      // Fetch existing tags
      .addCase(fetchExistingTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExistingTags.fulfilled, (state, action) => {
        state.loading = false;
        state.existingTags = action.payload;
      })
      .addCase(fetchExistingTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch existing tags";
      })
      // Add deal tag
      .addCase(addDealTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDealTag.fulfilled, (state, action) => {
        state.loading = false;
        state.dealTags.push(action.payload);
      })
      .addCase(addDealTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add deal tag";
      })
      // Delete deal tag
      .addCase(deleteDealTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDealTag.fulfilled, (state, action) => {
        state.loading = false;
        state.dealTags = state.dealTags.filter((tag) => tag.id !== action.payload.id);
      })
      .addCase(deleteDealTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete deal tag";
      });
  },
});

// Actions
export const { clearError } = dealTagsSlice.actions;

// Selectors
export const selectDealTags = (state: RootState) => state.dealTags.dealTags;
export const selectExistingTags = (state: RootState) => state.dealTags.existingTags;
export const selectDealTagsLoading = (state: RootState) => state.dealTags.loading;
export const selectDealTagsError = (state: RootState) => state.dealTags.error;

export default dealTagsSlice.reducer;
