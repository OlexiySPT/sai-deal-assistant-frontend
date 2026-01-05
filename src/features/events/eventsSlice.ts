import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import * as eventsAPI from "./eventsAPI";
import type {
  EventDto,
  EventListItemDto,
  CreateEventCommand,
  UpdateEventCommand,
} from "./eventsAPI";

// State interface
interface EventsState {
  events: EventListItemDto[];
  currentEvent: EventDto | null;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  totalItems: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (dealId?: number) => {
    return await eventsAPI.getEvents(dealId);
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id: number) => {
    return await eventsAPI.getEventById(id);
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (data: CreateEventCommand) => {
    return await eventsAPI.createEvent(data);
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, data }: { id: number; data: UpdateEventCommand }) => {
    return await eventsAPI.updateEvent(id, data);
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: number) => {
    await eventsAPI.deleteEvent(id);
    return id;
  }
);

// Slice
const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.items || [];
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })
      // Fetch event by id
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch event";
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create event";
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update event";
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((event) => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete event";
      });
  },
});

// Actions
export const { clearCurrentEvent, clearError } = eventsSlice.actions;

// Selectors
export const selectEvents = (state: RootState) => state.events.events;
export const selectCurrentEvent = (state: RootState) => state.events.currentEvent;
export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventsError = (state: RootState) => state.events.error;
export const selectEventsTotalItems = (state: RootState) => state.events.totalItems;

export default eventsSlice.reducer;
