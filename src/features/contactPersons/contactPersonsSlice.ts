import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as contactPersonsAPI from "./contactPersonsAPI";
import type {
  ContactPersonDto,
  ContactPersonListItemDto,
  CreateContactPersonCommand,
  UpdateContactPersonCommand,
} from "./contactPersonsAPI";

// State interface
interface ContactPersonsState {
  contactPersons: ContactPersonListItemDto[];
  currentContactPerson: ContactPersonDto | null;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: ContactPersonsState = {
  contactPersons: [],
  currentContactPerson: null,
  totalItems: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchContactPersons = createAsyncThunk(
  "contactPersons/fetchContactPersons",
  async (dealId?: number) => {
    return await contactPersonsAPI.getContactPersons(dealId);
  }
);

export const fetchContactPersonById = createAsyncThunk(
  "contactPersons/fetchContactPersonById",
  async (id: number) => {
    return await contactPersonsAPI.getContactPersonById(id);
  }
);

export const createContactPerson = createAsyncThunk(
  "contactPersons/createContactPerson",
  async (data: CreateContactPersonCommand) => {
    return await contactPersonsAPI.createContactPerson(data);
  }
);

export const updateContactPerson = createAsyncThunk(
  "contactPersons/updateContactPerson",
  async ({ id, data }: { id: number; data: UpdateContactPersonCommand }) => {
    return await contactPersonsAPI.updateContactPerson(id, data);
  }
);

export const deleteContactPerson = createAsyncThunk(
  "contactPersons/deleteContactPerson",
  async (id: number) => {
    await contactPersonsAPI.deleteContactPerson(id);
    return id;
  }
);

// Slice
const contactPersonsSlice = createSlice({
  name: "contactPersons",
  initialState,
  reducers: {
    clearCurrentContactPerson: (state) => {
      state.currentContactPerson = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contact persons
      .addCase(fetchContactPersons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactPersons.fulfilled, (state, action) => {
        state.loading = false;
        state.contactPersons = action.payload.items || [];
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchContactPersons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contact persons";
      })
      // Fetch contact person by id
      .addCase(fetchContactPersonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactPersonById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContactPerson = action.payload;
      })
      .addCase(fetchContactPersonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contact person";
      })
      // Create contact person
      .addCase(createContactPerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContactPerson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContactPerson = action.payload;
      })
      .addCase(createContactPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create contact person";
      })
      // Update contact person
      .addCase(updateContactPerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactPerson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContactPerson = action.payload;
      })
      .addCase(updateContactPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update contact person";
      })
      // Delete contact person
      .addCase(deleteContactPerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContactPerson.fulfilled, (state, action) => {
        state.loading = false;
        state.contactPersons = state.contactPersons.filter(
          (cp) => cp.id !== action.payload
        );
      })
      .addCase(deleteContactPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete contact person";
      });
  },
});

// Actions
export const { clearCurrentContactPerson, clearError } = contactPersonsSlice.actions;

// Selectors
export const selectContactPersons = (state: RootState) => state.contactPersons.contactPersons;
export const selectCurrentContactPerson = (state: RootState) => state.contactPersons.currentContactPerson;
export const selectContactPersonsLoading = (state: RootState) => state.contactPersons.loading;
export const selectContactPersonsError = (state: RootState) => state.contactPersons.error;
export const selectContactPersonsTotalItems = (state: RootState) => state.contactPersons.totalItems;

export default contactPersonsSlice.reducer;
