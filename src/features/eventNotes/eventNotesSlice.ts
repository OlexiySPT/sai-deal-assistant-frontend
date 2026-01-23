import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as eventNotesAPI from "./eventNotesAPI";
import type {
  EventNoteDto,
  EventNoteListItemDto,
  CreateEventNoteCommand,
  UpdateEventNoteCommand,
} from "./eventNotesAPI";

// State interface
interface EventNotesState {
  eventNotes: EventNoteListItemDto[];
  currentEventNote: EventNoteDto | null;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: EventNotesState = {
  eventNotes: [],
  currentEventNote: null,
  totalItems: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchEventNotes = createAsyncThunk(
  "eventNotes/fetchEventNotes",
  async (eventId?: number) => {
    return await eventNotesAPI.getEventNotes(eventId);
  }
);

export const fetchEventNoteById = createAsyncThunk(
  "eventNotes/fetchEventNoteById",
  async (id: number) => {
    return await eventNotesAPI.getEventNoteById(id);
  }
);

export const createEventNote = createAsyncThunk(
  "eventNotes/createEventNote",
  async (data: CreateEventNoteCommand) => {
    return await eventNotesAPI.createEventNote(data);
  }
);

export const updateEventNote = createAsyncThunk(
  "eventNotes/updateEventNote",
  async ({ id, data }: { id: number; data: UpdateEventNoteCommand }) => {
    return await eventNotesAPI.updateEventNote(id, data);
  }
);

export const deleteEventNote = createAsyncThunk(
  "eventNotes/deleteEventNote",
  async (id: number) => {
    await eventNotesAPI.deleteEventNote(id);
    return id;
  }
);

// Slice
const eventNotesSlice = createSlice({
  name: "eventNotes",
  initialState,
  reducers: {
    clearCurrentEventNote: (state) => {
      state.currentEventNote = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all event notes
      .addCase(fetchEventNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.eventNotes = action.payload.items || [];
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchEventNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch event notes";
      })
      // Fetch event note by id
      .addCase(fetchEventNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEventNote = action.payload;
      })
      .addCase(fetchEventNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch event note";
      })
      // Create event note
      .addCase(createEventNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEventNote.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEventNote = action.payload;
      })
      .addCase(createEventNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create event note";
      })
      // Update event note
      .addCase(updateEventNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventNote.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEventNote = action.payload;
      })
      .addCase(updateEventNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update event note";
      })
      // Delete event note
      .addCase(deleteEventNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEventNote.fulfilled, (state, action) => {
        state.loading = false;
        state.eventNotes = state.eventNotes.filter(
          (note) => note.id !== action.payload
        );
      })
      .addCase(deleteEventNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete event note";
      });
  },
});

// Actions
export const { clearCurrentEventNote, clearError } = eventNotesSlice.actions;

// Selectors
export const selectEventNotes = (state: RootState) =>
  state.eventNotes.eventNotes;
export const selectCurrentEventNote = (state: RootState) =>
  state.eventNotes.currentEventNote;
export const selectEventNotesLoading = (state: RootState) =>
  state.eventNotes.loading;
export const selectEventNotesError = (state: RootState) =>
  state.eventNotes.error;
export const selectEventNotesTotalItems = (state: RootState) =>
  state.eventNotes.totalItems;

export default eventNotesSlice.reducer;
