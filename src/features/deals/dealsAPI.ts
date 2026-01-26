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
}

export interface DealListItemDto {
  id: number;
  name: string | null;
  type: string | null;
  state: string | null;
  description: string | null;
  industry: string | null;
  createdAt: string;
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
}

export interface DealsQueryParams {
  Name?: string;
  Description?: string;
  Industry?: string;
  StateIds?: number | number[];
  TypeIds?: number | number[];
  SortBy?: string;
  SortDirection?: 0 | 1;
  Page?: number;
  PageSize?: number;
  SortDescending?: boolean;
}

// API Functions
export const getDeals = async (
  params?: DealsQueryParams,
): Promise<DealListItemDtoQueryResult> => {
  const response = await api.get<DealListItemDtoQueryResult>("/api/Deals", {
    params,
  });
  return response.data;
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
