import api from "../../services/api";

// Types
export interface ContactPersonDto {
  id: number;
  name: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
}

export interface ContactPersonListItemDto {
  id: number;
  name: string | null;
  position: string | null;
  email: string | null;
}

export interface ContactPersonListItemDtoQueryResult {
  totalItems: number;
  items: ContactPersonListItemDto[] | null;
}

export interface CreateContactPersonCommand {
  id: number;
  name: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  dealId: number;
}

export interface UpdateContactPersonCommand {
  id: number;
  name: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
}

// API Functions
export const getContactPersons = async (dealId?: number): Promise<ContactPersonListItemDtoQueryResult> => {
  const params = dealId ? { DealId: dealId } : {};
  const response = await api.get<ContactPersonListItemDtoQueryResult>("/api/ContactPersons", { params });
  return response.data;
};

export const getContactPersonById = async (id: number): Promise<ContactPersonDto> => {
  const response = await api.get<ContactPersonDto>(`/api/ContactPersons/${id}`);
  return response.data;
};

export const createContactPerson = async (data: CreateContactPersonCommand): Promise<ContactPersonDto> => {
  const response = await api.post<ContactPersonDto>("/api/ContactPersons", data);
  return response.data;
};

export const updateContactPerson = async (id: number, data: UpdateContactPersonCommand): Promise<ContactPersonDto> => {
  const response = await api.put<ContactPersonDto>(`/api/ContactPersons/${id}`, data);
  return response.data;
};

export const deleteContactPerson = async (id: number): Promise<void> => {
  await api.delete(`/api/ContactPersons/${id}`);
};
