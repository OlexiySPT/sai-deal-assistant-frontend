import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as aiMetadataAPI from "./aiMetadataAPI";
import type {
  AiMetadataDto,
  AiMetadataDtoQueryResult,
  AiMetadataQueryParams,
  CreateAiMetadataCommand,
  UpdateAiMetadataCommand,
} from "./aiMetadataAPI";

interface AiMetadataState {
  items: AiMetadataDto[];
  currentItem: AiMetadataDto | null;
  totalItems: number;
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: AiMetadataState = {
  items: [],
  currentItem: null,
  totalItems: 0,
  listLoading: false,
  detailLoading: false,
  error: null,
};

export const fetchAiMetadata = createAsyncThunk(
  "aiMetadata/fetchAiMetadata",
  async (params?: AiMetadataQueryParams) => {
    return await aiMetadataAPI.getAiMetadata(params);
  },
);

export const fetchAiMetadataById = createAsyncThunk(
  "aiMetadata/fetchAiMetadataById",
  async (id: number) => {
    return await aiMetadataAPI.getAiMetadataById(id);
  },
);

export const createAiMetadata = createAsyncThunk(
  "aiMetadata/createAiMetadata",
  async (data: CreateAiMetadataCommand) => {
    return await aiMetadataAPI.createAiMetadata(data);
  },
);

export const updateAiMetadata = createAsyncThunk(
  "aiMetadata/updateAiMetadata",
  async ({ id, data }: { id: number; data: UpdateAiMetadataCommand }) => {
    return await aiMetadataAPI.updateAiMetadata(id, data);
  },
);

const aiMetadataSlice = createSlice({
  name: "aiMetadata",
  initialState,
  reducers: {
    clearAiMetadata: (state) => {
      state.currentItem = null;
      state.error = null;
    },
    clearAiMetadataError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiMetadata.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAiMetadata.fulfilled, (state, action) => {
        state.listLoading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchAiMetadata.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to fetch AI metadata";
      })
      .addCase(fetchAiMetadataById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchAiMetadataById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchAiMetadataById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error =
          action.error.message || "Failed to fetch AI metadata item";
      })
      .addCase(createAiMetadata.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(createAiMetadata.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentItem = action.payload;
        state.items.push(action.payload);
        state.totalItems += 1;
      })
      .addCase(createAiMetadata.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to create AI metadata";
      })
      .addCase(updateAiMetadata.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(updateAiMetadata.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentItem = action.payload;
      })
      .addCase(updateAiMetadata.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to update AI metadata";
      });
  },
});

export const { clearAiMetadata, clearAiMetadataError } =
  aiMetadataSlice.actions;

export const selectAiMetadataItems = (state: RootState) =>
  state.aiMetadata.items;
export const selectAiMetadataCurrentItem = (state: RootState) =>
  state.aiMetadata.currentItem;
export const selectAiMetadataTotalItems = (state: RootState) =>
  state.aiMetadata.totalItems;
export const selectAiMetadataListLoading = (state: RootState) =>
  state.aiMetadata.listLoading;
export const selectAiMetadataDetailLoading = (state: RootState) =>
  state.aiMetadata.detailLoading;
export const selectAiMetadataError = (state: RootState) =>
  state.aiMetadata.error;

export default aiMetadataSlice.reducer;
