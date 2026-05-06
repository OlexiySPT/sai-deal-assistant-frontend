import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as aiPromptsAPI from "./aiPromptsAPI";
import type {
  AiPromptDto,
  AiPromptDtoQueryResult,
  AiPromptsQueryParams,
  CreateAiPromptCommand,
  UpdateAiPromptCommand,
} from "./aiPromptsAPI";

interface AiPromptsState {
  aiPrompts: AiPromptDto[];
  currentAiPrompt: AiPromptDto | null;
  totalItems: number;
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: AiPromptsState = {
  aiPrompts: [],
  currentAiPrompt: null,
  totalItems: 0,
  listLoading: false,
  detailLoading: false,
  error: null,
};

export const fetchAiPrompts = createAsyncThunk(
  "aiPrompts/fetchAiPrompts",
  async (params?: AiPromptsQueryParams) => {
    return await aiPromptsAPI.getAiPrompts(params);
  },
);

export const fetchAiPromptById = createAsyncThunk(
  "aiPrompts/fetchAiPromptById",
  async (id: number) => {
    return await aiPromptsAPI.getAiPromptById(id);
  },
);

export const createAiPrompt = createAsyncThunk(
  "aiPrompts/createAiPrompt",
  async (data: CreateAiPromptCommand) => {
    return await aiPromptsAPI.createAiPrompt(data);
  },
);

export const updateAiPrompt = createAsyncThunk(
  "aiPrompts/updateAiPrompt",
  async ({ id, data }: { id: number; data: UpdateAiPromptCommand }) => {
    return await aiPromptsAPI.updateAiPrompt(id, data);
  },
);

const aiPromptsSlice = createSlice({
  name: "aiPrompts",
  initialState,
  reducers: {
    clearCurrentAiPrompt: (state) => {
      state.currentAiPrompt = null;
      state.error = null;
    },
    clearAiPromptsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiPrompts.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAiPrompts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.aiPrompts = action.payload.items || [];
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchAiPrompts.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to fetch AI prompts";
      })
      .addCase(fetchAiPromptById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchAiPromptById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentAiPrompt = action.payload;
      })
      .addCase(fetchAiPromptById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to fetch AI prompt";
      })
      .addCase(createAiPrompt.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(createAiPrompt.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentAiPrompt = action.payload;
        const existingIndex = state.aiPrompts.findIndex(
          (prompt) => prompt.id === action.payload.id,
        );
        if (existingIndex === -1) {
          state.aiPrompts.push(action.payload);
          state.totalItems += 1;
        } else {
          state.aiPrompts[existingIndex] = action.payload;
        }
      })
      .addCase(createAiPrompt.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to create AI prompt";
      })
      .addCase(updateAiPrompt.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(updateAiPrompt.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentAiPrompt = action.payload;
      })
      .addCase(updateAiPrompt.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to update AI prompt";
      });
  },
});

export const { clearCurrentAiPrompt, clearAiPromptsError } =
  aiPromptsSlice.actions;

export const selectAiPrompts = (state: RootState) => state.aiPrompts.aiPrompts;
export const selectCurrentAiPrompt = (state: RootState) =>
  state.aiPrompts.currentAiPrompt;
export const selectAiPromptsTotalItems = (state: RootState) =>
  state.aiPrompts.totalItems;
export const selectAiPromptsListLoading = (state: RootState) =>
  state.aiPrompts.listLoading;
export const selectAiPromptsDetailLoading = (state: RootState) =>
  state.aiPrompts.detailLoading;
export const selectAiPromptsError = (state: RootState) => state.aiPrompts.error;

export default aiPromptsSlice.reducer;
