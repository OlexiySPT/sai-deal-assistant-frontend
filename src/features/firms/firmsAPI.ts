import api from "../../services/api";
import type { ContactPersonListItemDto } from "../contactPersons/contactPersonsAPI";

export interface FirmDto {
  id: number;
  name: string | null;
  country: string | null;
  description: string | null;
}

export interface FirmListItemDto {
  id: number;
  name: string | null;
  country: string | null;
}

export interface FirmForDropdownDto {
  id: number;
  name: string | null;
}

export interface FirmWithDependenciesDto {
  id: number;
  name: string | null;
  country: string | null;
  description: string | null;
  contactPersons: ContactPersonListItemDto[] | null;
}

export interface FirmListItemDtoQueryResult {
  totalItems: number;
  items: FirmListItemDto[] | null;
}

export interface FirmForDropdownDtoQueryResult {
  totalItems: number;
  items: FirmForDropdownDto[] | null;
}

export interface FirmQueryParams {
  Name?: string;
  SortBy?: string;
  SortDirection?: "Asc" | "Desc";
  Page?: number;
  PageSize?: number;
  SortDescending?: boolean;
}

export interface CreateFirmCommand {
  id: number;
  name?: string | null;
  country?: string | null;
  description?: string | null;
}

export interface UpdateFirmCommand extends CreateFirmCommand {}

export async function getFirms(
  params?: FirmQueryParams,
): Promise<FirmListItemDtoQueryResult> {
  const response = await api.get<FirmListItemDtoQueryResult>("/api/Firms", {
    params,
  });
  return response.data;
}

export async function getFirmsDropdown(
  params?: FirmQueryParams,
): Promise<FirmForDropdownDtoQueryResult> {
  const response = await api.get<FirmForDropdownDtoQueryResult>(
    "/api/Firms/dropdown",
    { params },
  );
  return response.data;
}

export async function getFirmById(id: number): Promise<FirmDto> {
  const response = await api.get<FirmDto>(`/api/Firms/${id}`);
  return response.data;
}

export async function getFirmWithDependencies(
  id: number,
): Promise<FirmWithDependenciesDto> {
  const response = await api.get<FirmWithDependenciesDto>(
    `/api/Firms/${id}/with-dependents`,
  );
  return response.data;
}

export async function createFirm(data: CreateFirmCommand): Promise<FirmDto> {
  const response = await api.post<FirmDto>("/api/Firms", data);
  return response.data;
}

export async function updateFirm(
  id: number,
  data: UpdateFirmCommand,
): Promise<FirmDto> {
  const response = await api.put<FirmDto>(`/api/Firms/${id}`, data);
  return response.data;
}

export async function deleteFirm(id: number): Promise<void> {
  await api.delete(`/api/Firms/${id}`);
}
