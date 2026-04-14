import api from "../../services/api";

// Types
export interface DealTagDto {
  id: number;
  tag: string | null;
  dealId: number;
}

export interface AddDealTagIfNotExistsCommand {
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
let existingTagsPending: Promise<string[]> | null = null;

export const getExistingTags = async (): Promise<string[]> => {
  const now = Date.now();
  if (existingTagsCache && now - existingTagsCache.timestamp < CACHE_DURATION) {
    return existingTagsCache.data;
  }
  if (existingTagsPending) return existingTagsPending;
  existingTagsPending = api
    .get<string[]>("/api/DealTags/existing")
    .then((response) => {
      existingTagsCache = { data: response.data, timestamp: Date.now() };
      existingTagsPending = null;
      return response.data;
    })
    .catch((err) => {
      existingTagsPending = null;
      throw err;
    });
  return existingTagsPending;
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

export const deleteDealTag = async (
  data: AddDealTagIfNotExistsCommand,
): Promise<DealTagDto> => {
  const response = await api.delete<DealTagDto>(
    `/api/DealTags?DealId=${data.dealId}&Tag=${data.tag}`,
  );
  return response.data;
};
