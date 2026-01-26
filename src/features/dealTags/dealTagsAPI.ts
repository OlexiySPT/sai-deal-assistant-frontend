import api from "../../services/api";

// Types
export interface DealTagDto {
  id: number;
  tag: string | null;
  dealId: number;
}

export interface AddDealTagIfNotExistsCommand {
  id: number;
  tag: string | null;
  dealId: number;
}

// API Functions
export const getDealTags = async (dealId?: number): Promise<DealTagDto[]> => {
  const params = dealId ? { DealId: dealId } : {};
  const response = await api.get<DealTagDto[]>("/api/DealTags", { params });
  return response.data;
};

export const getExistingTags = async (): Promise<string[]> => {
  const response = await api.get<string[]>("/api/DealTags/existing");
  return response.data;
};

export const addDealTag = async (data: AddDealTagIfNotExistsCommand): Promise<DealTagDto> => {
  const response = await api.post<DealTagDto>("/api/DealTags", data);
  return response.data;
};

export const deleteDealTag = async (id: number): Promise<DealTagDto> => {
  const response = await api.delete<DealTagDto>(`/api/DealTags/${id}`);
  return response.data;
};
