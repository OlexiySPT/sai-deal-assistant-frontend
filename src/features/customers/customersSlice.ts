import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { customersAPI } from "./customersAPI";
import type {
  SampleCustomerDto,
  SampleCustomerPreviewDto,
  CreateSampleCustomerRequest,
  UpdateSampleCustomerRequest,
  CustomerQueryParams,
  QueryResult,
} from "../../types";

interface CustomersState {
  customers: SampleCustomerPreviewDto[];
  currentCustomer: SampleCustomerDto | null;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  currentCustomer: null,
  totalItems: 0,
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (params?: CustomerQueryParams) => {
    const response = await customersAPI.getAll(params);
    const data = response.data as QueryResult<SampleCustomerPreviewDto>;
    return data;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (id: number) => {
    const response = await customersAPI.getById(id);
    return response.data as SampleCustomerDto;
  }
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (customer: CreateSampleCustomerRequest) => {
    const response = await customersAPI.create(customer);
    return response.data as SampleCustomerDto;
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, data }: { id: number; data: UpdateSampleCustomerRequest }) => {
    const response = await customersAPI.update(id, data);
    return response.data as SampleCustomerDto;
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomers.fulfilled,
        (
          state,
          action: PayloadAction<QueryResult<SampleCustomerPreviewDto>>
        ) => {
          state.loading = false;
          state.customers = action.payload.items || [];
          state.totalItems = action.payload.totalItems;
        }
      )
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customers";
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomerById.fulfilled,
        (state, action: PayloadAction<SampleCustomerDto>) => {
          state.loading = false;
          state.currentCustomer = action.payload;
        }
      )
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customer";
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCustomer.fulfilled,
        (state, action: PayloadAction<SampleCustomerDto>) => {
          state.loading = false;
          // Add to preview list
          const preview: SampleCustomerPreviewDto = {
            id: action.payload.id,
            code: action.payload.code,
            name: action.payload.name,
            fullName: `${action.payload.code} - ${action.payload.name}`,
          };
          state.customers.push(preview);
          state.totalItems += 1;
        }
      )
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create customer";
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCustomer.fulfilled,
        (state, action: PayloadAction<SampleCustomerDto>) => {
          state.loading = false;
          const index = state.customers.findIndex(
            (cust) => cust.id === action.payload.id
          );
          if (index !== -1) {
            state.customers[index] = {
              id: action.payload.id,
              code: action.payload.code,
              name: action.payload.name,
              fullName: `${action.payload.code} - ${action.payload.name}`,
            };
          }
          state.currentCustomer = action.payload;
        }
      )
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update customer";
      });
  },
});

export const { clearCurrentCustomer, clearError } = customersSlice.actions;

export const selectCustomers = (state: RootState) => state.customers.customers;
export const selectCurrentCustomer = (state: RootState) =>
  state.customers.currentCustomer;
export const selectCustomersLoading = (state: RootState) =>
  state.customers.loading;
export const selectCustomersError = (state: RootState) => state.customers.error;
export const selectCustomersTotalItems = (state: RootState) =>
  state.customers.totalItems;

export default customersSlice.reducer;
