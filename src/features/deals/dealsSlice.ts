import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as dealsAPI from "./dealsAPI";
import type {
  DealDto,
  DealListItemDto,
  DealWithDependentsDto,
  CreateDealCommand,
  UpdateDealCommand,
  DealsQueryParams,
} from "./dealsAPI";

// State interface
interface DealsState {
  deals: DealListItemDto[];
  currentDeal: DealDto | null;
  currentDealWithDependents: DealWithDependentsDto | null;
  totalItems: number;
  // Separate loading flags for list vs detail to avoid UI flicker
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: DealsState = {
  deals: [],
  currentDeal: null,
  currentDealWithDependents: null,
  totalItems: 0,
  listLoading: false,
  detailLoading: false,
  error: null,
};

// Async thunks
export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async (params?: DealsQueryParams) => {
    return await dealsAPI.getDeals(params);
  },
);

export const fetchDealById = createAsyncThunk(
  "deals/fetchDealById",
  async (id: number) => {
    return await dealsAPI.getDealById(id);
  },
);

export const fetchCachedDealStatuses = createAsyncThunk(
  "deals/statuses/cached",
  async () => {
    return await dealsAPI.getCachedDealStatuses();
  },
);

export const fetchDealWithDependents = createAsyncThunk(
  "deals/fetchDealWithDependents",
  async (id: number) => {
    return await dealsAPI.getDealWithDependents(id);
  },
);

export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (data: CreateDealCommand) => {
    return await dealsAPI.createDeal(data);
  },
);

export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async ({ id, data }: { id: number; data: UpdateDealCommand }) => {
    return await dealsAPI.updateDeal(id, data);
  },
);

export const deleteDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (id: number) => {
    await dealsAPI.deleteDeal(id);
    return id;
  },
);

// Slice
const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    clearCurrentDeal: (state) => {
      state.currentDeal = null;
      state.currentDealWithDependents = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all deals
      .addCase(fetchDeals.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.listLoading = false;
        state.deals = action.payload.items || [];
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to fetch deals";
      })
      // Fetch deal by id
      .addCase(fetchDealById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchDealById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDeal = action.payload;
      })
      .addCase(fetchDealById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to fetch deal";
      })
      // Fetch deal with dependents
      .addCase(fetchDealWithDependents.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchDealWithDependents.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDealWithDependents = action.payload;
      })
      .addCase(fetchDealWithDependents.rejected, (state, action) => {
        state.detailLoading = false;
        state.error =
          action.error.message || "Failed to fetch deal with dependents";
      })
      // Create deal
      .addCase(createDeal.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDeal = action.payload;
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to create deal";
      })
      // Update deal
      .addCase(updateDeal.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDeal = action.payload;
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed to update deal";
      })
      // Delete deal
      .addCase(deleteDeal.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.listLoading = false;
        state.deals = state.deals.filter((deal) => deal.id !== action.payload);
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to delete deal";
      });
  },
});

// Actions
export const { clearCurrentDeal, clearError } = dealsSlice.actions;

// Selectors
export const selectDeals = (state: RootState) => state.deals.deals;
export const selectCurrentDeal = (state: RootState) => state.deals.currentDeal;
export const selectCurrentDealWithDependents = (state: RootState) =>
  state.deals.currentDealWithDependents;
export const selectDealsLoading = (state: RootState) => state.deals.listLoading;
export const selectDealLoading = (state: RootState) =>
  state.deals.detailLoading;
export const selectDealsError = (state: RootState) => state.deals.error;
export const selectDealsTotalItems = (state: RootState) =>
  state.deals.totalItems;

export default dealsSlice.reducer;
