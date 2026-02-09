import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fieldUpdateAPI, {
  UpdateStringFieldCommand,
  UpdateNumericFieldCommand,
  UpdateDateFieldCommand,
} from "./fieldUpdateAPI";

interface FieldUpdateState {
  loading: boolean;
  error: string | null;
}

const initialState: FieldUpdateState = {
  loading: false,
  error: null,
};

export const updateStringField = createAsyncThunk(
  "fieldUpdate/updateString",
  async (data: UpdateStringFieldCommand, { rejectWithValue }) => {
    try {
      const response = await fieldUpdateAPI.updateString(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  },
);

export const updateNumericField = createAsyncThunk(
  "fieldUpdate/updateNumeric",
  async (data: UpdateNumericFieldCommand, { rejectWithValue }) => {
    try {
      const response = await fieldUpdateAPI.updateNumeric(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  },
);

export const updateDateField = createAsyncThunk(
  "fieldUpdate/updateDate",
  async (data: UpdateDateFieldCommand, { rejectWithValue }) => {
    try {
      const response = await fieldUpdateAPI.updateDate(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  },
);

const fieldUpdateSlice = createSlice({
  name: "fieldUpdate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateStringField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStringField.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStringField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateNumericField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNumericField.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateNumericField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDateField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDateField.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateDateField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default fieldUpdateSlice.reducer;
