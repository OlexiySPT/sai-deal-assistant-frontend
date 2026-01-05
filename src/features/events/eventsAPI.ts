import api from "../../services/api";

// Types
export interface EventDto {
  id: number;
  date: string;
  pos: number;
  agenda: string | null;
  result: string | null;
  contactPersonId: number | null;
  typeId: number;
  stateId: number;
}

export interface EventListItemDto {
  id: number;
  date: string;
  type: string | null;
  contactPerson: string | null;
  state: string | null;
  agenda: string | null;
  result: string | null;
  pos: number;
}

export interface EventWithDependenciesListItemDto {
  id: number;
  date: string;
  type: string | null;
  contactPerson: string | null;
  state: string | null;
  agenda: string | null;
  result: string | null;
  pos: number;
  notes: any[] | null;
}

export interface EventListItemDtoQueryResult {
  totalItems: number;
  items: EventListItemDto[] | null;
}

export interface CreateEventCommand {
  id: number;
  date: string;
  pos: number;
  agenda: string | null;
  result: string | null;
  contactPersonId: number | null;
  typeId: number;
  stateId: number;
  dealId: number;
}

export interface UpdateEventCommand {
  id: number;
  date: string;
  pos: number;
  agenda: string | null;
  result: string | null;
  contactPersonId: number | null;
  typeId: number;
  stateId: number;
}

// API Functions
export const getEvents = async (
  dealId?: number
): Promise<EventListItemDtoQueryResult> => {
  const params = dealId ? { DealId: dealId } : {};
  const response = await api.get<EventListItemDtoQueryResult>("/api/Events", {
    params,
  });
  return response.data;
};

export const getEventById = async (id: number): Promise<EventDto> => {
  const response = await api.get<EventDto>(`/api/Events/${id}`);
  return response.data;
};

export const createEvent = async (
  data: CreateEventCommand
): Promise<EventDto> => {
  const response = await api.post<EventDto>("/api/Events", data);
  return response.data;
};

export const updateEvent = async (
  id: number,
  data: UpdateEventCommand
): Promise<EventDto> => {
  const response = await api.put<EventDto>(`/api/Events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/api/Events/${id}`);
};
