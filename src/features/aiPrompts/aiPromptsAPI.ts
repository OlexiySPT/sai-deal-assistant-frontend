import api from "../../services/api";

export interface AiPromptDto {
  id: number;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

export interface AiPromptDtoQueryResult {
  totalItems: number;
  items: AiPromptDto[] | null;
}

export interface CreateAiPromptCommand {
  id?: number;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

export interface UpdateAiPromptCommand {
  id: number;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

export interface AiPromptsQueryParams {
  Key?: string;
  SortBy?: string;
  SortDirection?: "Asc" | "Desc";
  Page?: number;
  PageSize?: number;
  SortDescending?: boolean;
}

const aiPromptsPending: {
  [key: string]: Promise<AiPromptDtoQueryResult> | undefined;
} = {};

export async function getAiPrompts(
  params?: AiPromptsQueryParams,
): Promise<AiPromptDtoQueryResult> {
  const key = JSON.stringify(params || {});
  const existing = aiPromptsPending[key];
  if (existing) return existing;
  const promise = api
    .get<AiPromptDtoQueryResult>("/api/AiPrompts", { params })
    .then((response) => {
      delete aiPromptsPending[key];
      return response.data;
    })
    .catch((err) => {
      delete aiPromptsPending[key];
      throw err;
    });
  aiPromptsPending[key] = promise;
  return promise;
}

export async function getAiPromptById(id: number): Promise<AiPromptDto> {
  const response = await api.get<AiPromptDto>(`/api/AiPrompts/${id}`);
  return response.data;
}

export async function createAiPrompt(
  data: CreateAiPromptCommand,
): Promise<AiPromptDto> {
  const response = await api.post<AiPromptDto>("/api/AiPrompts", data);
  return response.data;
}

export async function updateAiPrompt(
  id: number,
  data: UpdateAiPromptCommand,
): Promise<AiPromptDto> {
  const response = await api.put<AiPromptDto>(`/api/AiPrompts/${id}`, data);
  return response.data;
}
