import api from "../../services/api";

export interface AiMetadataDto {
  id: number;
  type?: string | null;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

export interface AiMetadataDtoQueryResult {
  totalItems: number;
  items: AiMetadataDto[] | null;
}

export interface CreateAiMetadataCommand {
  id: number;
  type?: string | null;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

export interface UpdateAiMetadataCommand {
  id: number;
  type?: string | null;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

export interface AiMetadataQueryParams {
  Type?: string;
  Key?: string;
  SortBy?: string;
  SortDirection?: "Asc" | "Desc";
  Page?: number;
  PageSize?: number;
  SortDescending?: boolean;
}

export async function getAiMetadata(
  params?: AiMetadataQueryParams,
): Promise<AiMetadataDtoQueryResult> {
  const response = await api.get<AiMetadataDtoQueryResult>("/api/AiMetadata", {
    params,
  });
  return response.data;
}

export async function getAiMetadataById(id: number): Promise<AiMetadataDto> {
  const response = await api.get<AiMetadataDto>(`/api/AiMetadata/${id}`);
  return response.data;
}

export async function createAiMetadata(
  data: CreateAiMetadataCommand,
): Promise<AiMetadataDto> {
  const response = await api.post<AiMetadataDto>("/api/AiMetadata", data);
  return response.data;
}

export async function updateAiMetadata(
  id: number,
  data: UpdateAiMetadataCommand,
): Promise<AiMetadataDto> {
  const response = await api.put<AiMetadataDto>(`/api/AiMetadata/${id}`, data);
  return response.data;
}
