import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as dealAutomationAPI from "./dealAutomationAPI";

interface DealAutomationState {
  result: dealAutomationAPI.DealAutomationResult | null;
  loading: boolean;
  error: string | null;
}

type DealAutomationRootState = {
  dealAutomation: DealAutomationState;
};

const initialState: DealAutomationState = {
  result: null,
  loading: false,
  error: null,
};

export const processDealAutomationPage = createAsyncThunk(
  "dealAutomation/processPage",
  async (data: dealAutomationAPI.ProcessPageCommand) => {
    return await dealAutomationAPI.readPage(data);
  },
);

export const extractDealAutomationText = createAsyncThunk(
  "dealAutomation/extractText",
  async (data: dealAutomationAPI.ExtractTextCommand) => {
    return await dealAutomationAPI.extractText(data);
  },
);

export const generateDealAutomationCoverLetter = createAsyncThunk(
  "dealAutomation/generateCoverLetter",
  async (id: number) => {
    return await dealAutomationAPI.generateCoverLetter(id);
  },
);

const dealAutomationSlice = createSlice({
  name: "dealAutomation",
  initialState,
  reducers: {
    clearDealAutomationResult: (state) => {
      state.result = null;
      state.error = null;
    },
    clearDealAutomationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processDealAutomationPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processDealAutomationPage.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(processDealAutomationPage.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to process DealAutomation page";
      })
      .addCase(generateDealAutomationCoverLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDealAutomationCoverLetter.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(generateDealAutomationCoverLetter.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to generate cover letter";
      })
      .addCase(extractDealAutomationText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extractDealAutomationText.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(extractDealAutomationText.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to extract text";
      });
  },
});

export const { clearDealAutomationResult, clearDealAutomationError } =
  dealAutomationSlice.actions;

export const selectDealAutomationResult = (state: DealAutomationRootState) =>
  state.dealAutomation.result;
export const selectDealAutomationLoading = (state: DealAutomationRootState) =>
  state.dealAutomation.loading;
export const selectDealAutomationError = (state: DealAutomationRootState) =>
  state.dealAutomation.error;

export default dealAutomationSlice.reducer;
