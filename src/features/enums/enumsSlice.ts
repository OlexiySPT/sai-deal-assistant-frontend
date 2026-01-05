import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as enumsAPI from "./enumsAPI";
import type { EnumValue } from "./enumsAPI";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// State interface
interface EnumsState {
  enumNames: string[];
  enumValues: { [enumName: string]: EnumValue[] };
  lastFetched: number | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: EnumsState = {
  enumNames: [],
  enumValues: {},
  lastFetched: null,
  loading: false,
  error: null,
  initialized: false,
};

// Async thunks
export const fetchEnumNames = createAsyncThunk(
  "enums/fetchEnumNames",
  async () => {
    return await enumsAPI.getEnumNames();
  }
);

export const fetchEnumValues = createAsyncThunk(
  "enums/fetchEnumValues",
  async (enumName: string) => {
    const values = await enumsAPI.getEnumValues(enumName);
    return { enumName, values };
  }
);

// Load all enums at once
export const loadAllEnums = createAsyncThunk(
  "enums/loadAllEnums",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const now = Date.now();

    // Check if cache is still valid
    if (
      state.enums.initialized &&
      state.enums.lastFetched &&
      now - state.enums.lastFetched < CACHE_DURATION
    ) {
      return null; // Skip loading if cache is valid
    }

    // Fetch all enum names first
    const enumNames = await enumsAPI.getEnumNames();

    // Fetch all enum values in parallel
    const enumValuesPromises = enumNames.map(async (enumName) => {
      const values = await enumsAPI.getEnumValues(enumName);
      return { enumName, values };
    });

    const enumValuesResults = await Promise.all(enumValuesPromises);

    // Convert to object
    const enumValues: { [enumName: string]: EnumValue[] } = {};
    enumValuesResults.forEach(({ enumName, values }) => {
      enumValues[enumName] = values;
    });

    return { enumNames, enumValues };
  }
);

// Slice
const enumsSlice = createSlice({
  name: "enums",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch enum names
      .addCase(fetchEnumNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnumNames.fulfilled, (state, action) => {
        state.loading = false;
        state.enumNames = action.payload;
      })
      .addCase(fetchEnumNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch enum names";
      })
      // Fetch enum values
      .addCase(fetchEnumValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnumValues.fulfilled, (state, action) => {
        state.loading = false;
        state.enumValues[action.payload.enumName] = action.payload.values;
      })
      .addCase(fetchEnumValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch enum values";
      })
      // Load all enums
      .addCase(loadAllEnums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAllEnums.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.enumNames = action.payload.enumNames;
          state.enumValues = action.payload.enumValues;
          state.lastFetched = Date.now();
          state.initialized = true;
        }
      })
      .addCase(loadAllEnums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load all enums";
      });
  },
});

// Actions
export const { clearError } = enumsSlice.actions;

// Selectors
export const selectEnumNames = (state: RootState) => state.enums.enumNames;
export const selectEnumValues = (enumName: string) => (state: RootState) =>
  state.enums.enumValues[enumName] || [];
export const selectAllEnumValues = (state: RootState) => state.enums.enumValues;
export const selectEnumsLoading = (state: RootState) => state.enums.loading;
export const selectEnumsError = (state: RootState) => state.enums.error;
export const selectEnumsInitialized = (state: RootState) =>
  state.enums.initialized;

export default enumsSlice.reducer;
