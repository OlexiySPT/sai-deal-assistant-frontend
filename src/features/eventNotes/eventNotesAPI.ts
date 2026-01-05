import api from "../../services/api";

// Types
export interface EventNoteDto {
  id: number;
  order: number;
  text: string | null;
  eventId: number;
}

export interface EventNoteListItemDto {
  id: number;
  order: number;
  text: string | null;
}

export interface EventNoteListItemDtoQueryResult {
  totalItems: number;
  items: EventNoteListItemDto[] | null;
}

export interface CreateEventNoteCommand {
  id: number;
  order: number;
  text: string | null;
  eventId: number;
}

export interface UpdateEventNoteCommand {
  id: number;
  order: number;
  text: string | null;
  eventId: number;
}

// API Functions
export const getEventNotes = async (
  eventId?: number
): Promise<EventNoteListItemDtoQueryResult> => {
  const params = eventId ? { EventId: eventId } : {};
  const response = await api.get<EventNoteListItemDtoQueryResult>(
    "/api/EventNotes",
    { params }
  );
  return response.data;
};

export const getEventNoteById = async (id: number): Promise<EventNoteDto> => {
  const response = await api.get<EventNoteDto>(`/api/EventNotes/${id}`);
  return response.data;
};

export const createEventNote = async (
  data: CreateEventNoteCommand
): Promise<EventNoteDto> => {
  const response = await api.post<EventNoteDto>("/api/EventNotes", data);
  return response.data;
};

export const updateEventNote = async (
  id: number,
  data: UpdateEventNoteCommand
): Promise<EventNoteDto> => {
  const response = await api.put<EventNoteDto>(`/api/EventNotes/${id}`, data);
  return response.data;
};

export const deleteEventNote = async (id: number): Promise<void> => {
  await api.delete(`/api/EventNotes/${id}`);
};
