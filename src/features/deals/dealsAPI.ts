import api from "../../services/api";

// Types
export interface DealDto {
  id: number;
  name: string | null;
  description: string | null;
  url: string | null;
  aiSearchInfo: string | null;
  aiBriefDescription: string | null;
  industry: string | null;
  status: string | null;
  typeId: number;
  stateId: number;
  proposalAmount: number | null;
  minClientAmount: number | null;
  maxClientAmount: number | null;
  currencyCode: string | null;
  exchangeRate: number | null;
  amountTypeId: number | null;
  amountType: string | null;
}

export interface DealListItemDto {
  id: number;
  name: string | null;
  type: string | null;
  state: string | null;
  description: string | null;
  industry: string | null;
  createdAt: string;
  proposalAmount: number | null;
  currencyCode: string | null;
  amountType: string | null;
}

export interface DealListItemDtoQueryResult {
  totalItems: number;
  items: DealListItemDto[] | null;
}

export interface DealWithDependentsDto {
  id: number;
  name: string | null;
  description: string | null;
  url: string | null;
  aiSearchInfo: string | null;
  aiBriefDescription: string | null;
  industry: string | null;
  status: string | null;
  type: string | null;
  state: string | null;
  contactPersons: any[] | null;
  events: any[] | null;
  tags: any[] | null;
  proposalAmount: number | null;
  minClientAmount: number | null;
  maxClientAmount: number | null;
  currencyCode: string | null;
  exchangeRate: number | null;
  amountTypeId: number | null;
  amountType: string | null;
}

export interface CreateDealCommand {
  id: number;
  name: string | null;
  description: string | null;
  url: string | null;
  aiSearchInfo: string | null;
  aiBriefDescription: string | null;
  industry: string | null;
  status: string | null;
  typeId: number;
  stateId: number;
  proposalAmount: number | null;
  minClientAmount: number | null;
  maxClientAmount: number | null;
  currencyCode: string | null;
  exchangeRate: number | null;
  amountTypeId: number | null;
  amountType: string | null;
}

export interface UpdateDealCommand {
  id: number;
  name: string | null;
  description: string | null;
  url: string | null;
  aiSearchInfo: string | null;
  aiBriefDescription: string | null;
  industry: string | null;
  status: string | null;
  typeId: number;
  stateId: number;
  proposalAmount: number | null;
  minClientAmount: number | null;
  maxClientAmount: number | null;
  currencyCode: string | null;
  exchangeRate: number | null;
  amountTypeId: number | null;
  amountType: string | null;
}

export interface DealsQueryParams {
  Name?: string;
  Description?: string;
  Industry?: string;
  Status?: string;
  StateIds?: number | number[];
  TypeIds?: number | number[];
  SortBy?: string;
  SortDirection?: 0 | 1;
  Page?: number;
  PageSize?: number;
  SortDescending?: boolean;
}

// API Functions
const dealsPending: {
  [key: string]: Promise<DealListItemDtoQueryResult> | undefined;
} = {};
export const getDeals = async (
  params?: DealsQueryParams,
): Promise<DealListItemDtoQueryResult> => {
  const key = JSON.stringify(params || {});
  const existing = dealsPending[key];
  if (existing) return existing;
  const promise = api
    .get<DealListItemDtoQueryResult>("/api/Deals", { params })
    .then((response) => {
      delete dealsPending[key];
      return response.data;
    })
    .catch((err) => {
      delete dealsPending[key];
      throw err;
    });
  dealsPending[key] = promise;
  return promise;
};

export const getDealById = async (id: number): Promise<DealDto> => {
  const response = await api.get<DealDto>(`/api/Deals/${id}`);
  return response.data;
};

export const getDealWithDependents = async (
  id: number,
): Promise<DealWithDependentsDto> => {
  const response = await api.get<DealWithDependentsDto>(
    `/api/Deals/${id}/with-dependents`,
  );
  return response.data;
};

export const createDeal = async (data: CreateDealCommand): Promise<DealDto> => {
  const response = await api.post<DealDto>("/api/Deals", data);
  return response.data;
};

export const updateDeal = async (
  id: number,
  data: UpdateDealCommand,
): Promise<DealDto> => {
  const response = await api.put<DealDto>(`/api/Deals/${id}`, data);
  return response.data;
};

export const deleteDeal = async (id: number): Promise<void> => {
  await api.delete(`/api/Deals/${id}`);
};

// Simple in-memory cache for existing statuses
let existingStatusesCache: { data: string[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedDealStatuses = async (): Promise<string[]> => {
  const now = Date.now();
  if (
    existingStatusesCache &&
    now - existingStatusesCache.timestamp < CACHE_DURATION
  ) {
    return existingStatusesCache.data;
  }
  const response = await api.get<string[]>("/api/Deals/statuses/cached");
  existingStatusesCache = { data: response.data, timestamp: now };
  return response.data;
};
