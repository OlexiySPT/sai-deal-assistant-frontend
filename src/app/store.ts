import { configureStore } from "@reduxjs/toolkit";
import contactPersonsReducer from "../features/contactPersons/contactPersonsSlice";
import dealsReducer from "../features/deals/dealsSlice";
import dealTagsReducer from "../features/dealTags/dealTagsSlice";
import eventsReducer from "../features/events/eventsSlice";
import eventNotesReducer from "../features/eventNotes/eventNotesSlice";
import enumsReducer from "../features/enums/enumsSlice";
import textareaReducer from "../features/textarea/textareaSlice";

export const store = configureStore({
  reducer: {
    contactPersons: contactPersonsReducer,
    deals: dealsReducer,
    dealTags: dealTagsReducer,
    events: eventsReducer,
    eventNotes: eventNotesReducer,
    enums: enumsReducer,
    textarea: textareaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
