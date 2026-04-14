import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as firmsAPI from "./firmsAPI";
import type {
  CreateFirmCommand,
  FirmDto,
  FirmForDropdownDto,
  FirmListItemDto,
  FirmQueryParams,
  FirmWithDependenciesDto,
  UpdateFirmCommand,
} from "./firmsAPI";

interface FirmsState {
  firms: FirmListItemDto[];
  firmDropdown: FirmForDropdownDto[];
  currentFirm: FirmDto | null;
  currentFirmWithDependencies: FirmWithDependenciesDto | null;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: FirmsState = {
  firms: [],
  firmDropdown: [],
  currentFirm: null,
  currentFirmWithDependencies: null,
  totalItems: 0,
  loading: false,
  error: null,
};

export const fetchFirms = createAsyncThunk(
  "firms/fetchFirms",
  async (params?: FirmQueryParams) => {
    return await firmsAPI.getFirms(params);
  },
);

export const fetchFirmDropdown = createAsyncThunk(
  "firms/fetchFirmDropdown",
  async (params?: FirmQueryParams) => {
    return await firmsAPI.getFirmsDropdown(params);
  },
);

export const fetchFirmById = createAsyncThunk(
  "firms/fetchFirmById",
  async (id: number) => {
    return await firmsAPI.getFirmById(id);
  },
);

export const fetchFirmWithDependencies = createAsyncThunk(
  "firms/fetchFirmWithDependencies",
  async (id: number) => {
    return await firmsAPI.getFirmWithDependencies(id);
  },
);

export const createFirm = createAsyncThunk(
  "firms/createFirm",
  async (data: CreateFirmCommand) => {
    return await firmsAPI.createFirm(data);
  },
);

export const updateFirm = createAsyncThunk(
  "firms/updateFirm",
  async ({ id, data }: { id: number; data: UpdateFirmCommand }) => {
    return await firmsAPI.updateFirm(id, data);
  },
);

export const deleteFirm = createAsyncThunk(
  "firms/deleteFirm",
  async (id: number) => {
    await firmsAPI.deleteFirm(id);
    return id;
  },
);

const firmsSlice = createSlice({
  name: "firms",
  initialState,
  reducers: {
    clearCurrentFirm: (state) => {
      state.currentFirm = null;
      state.currentFirmWithDependencies = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFirms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFirms.fulfilled, (state, action) => {
        state.loading = false;
        state.firms = action.payload.items || [];
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchFirms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch firms";
      })
      .addCase(fetchFirmDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFirmDropdown.fulfilled, (state, action) => {
        state.loading = false;
        state.firmDropdown = action.payload.items || [];
      })
      .addCase(fetchFirmDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch firms";
      })
      .addCase(fetchFirmById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFirmById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFirm = action.payload;
      })
      .addCase(fetchFirmById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch firm";
      })
      .addCase(fetchFirmWithDependencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFirmWithDependencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFirmWithDependencies = action.payload;
      })
      .addCase(fetchFirmWithDependencies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch firm with dependencies";
      })
      .addCase(createFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFirm.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFirm = action.payload;
      })
      .addCase(createFirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create firm";
      })
      .addCase(updateFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFirm.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFirm = action.payload;
      })
      .addCase(updateFirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update firm";
      })
      .addCase(deleteFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFirm.fulfilled, (state, action) => {
        state.loading = false;
        state.firms = state.firms.filter((firm) => firm.id !== action.payload);
        state.firmDropdown = state.firmDropdown.filter(
          (firm) => firm.id !== action.payload,
        );
      })
      .addCase(deleteFirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete firm";
      });
  },
});

export const { clearCurrentFirm, clearError } = firmsSlice.actions;

export const selectFirms = (state: RootState) => state.firms.firms;
export const selectFirmDropdown = (state: RootState) =>
  state.firms.firmDropdown;
export const selectCurrentFirm = (state: RootState) => state.firms.currentFirm;
export const selectCurrentFirmWithDependencies = (state: RootState) =>
  state.firms.currentFirmWithDependencies;
export const selectFirmsLoading = (state: RootState) => state.firms.loading;
export const selectFirmsError = (state: RootState) => state.firms.error;

export default firmsSlice.reducer;
