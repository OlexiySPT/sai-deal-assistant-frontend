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

// Simple in-memory cache for existing tags
let existingTagsCache: { data: string[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getExistingTags = async (): Promise<string[]> => {
  const now = Date.now();
  if (existingTagsCache && now - existingTagsCache.timestamp < CACHE_DURATION) {
    return existingTagsCache.data;
  }
  const response = await api.get<string[]>("/api/DealTags/existing");
  existingTagsCache = { data: response.data, timestamp: now };
  return response.data;
};

// Optional: function to clear the cache manually if needed
export const clearExistingTagsCache = () => {
  existingTagsCache = null;
};

export const addDealTag = async (
  data: AddDealTagIfNotExistsCommand,
): Promise<DealTagDto> => {
  const response = await api.post<DealTagDto>("/api/DealTags", data);
  return response.data;
};

export const deleteDealTag = async (id: number): Promise<DealTagDto> => {
  const response = await api.delete<DealTagDto>(`/api/DealTags/${id}`);
  return response.data;
};
