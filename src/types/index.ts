// Common Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
}

export interface QueryResult<T> {
  totalItems: number;
  items: T[] | null;
}

export enum SortDirections {
  Ascending = 0,
  Descending = 1,
}

// Customer Types
export interface SampleCustomerDto {
  id: number;
  code?: string | null;
  name?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  taxNumber?: string | null;
  vatPayerNumber?: string | null;
  socialSecurityPayerNumber?: string | null;
  taxPayerScheme?: string | null;
  registrationDate: string;
}

export interface SampleCustomerPreviewDto {
  id: number;
  code?: string | null;
  name?: string | null;
  fullName?: string | null;
}

export interface CreateSampleCustomerRequest {
  code?: string | null;
  name?: string | null;
  postalCode?: string | null;
  addressLn1?: string | null;
  addressLn2?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  taxNumber?: string | null;
  vatPayerNumber?: string | null;
  socialSecurityPayerNumber?: string | null;
  taxPayerScheme?: string | null;
  registrationDate: string;
}

export interface UpdateSampleCustomerRequest {
  code?: string | null;
  name?: string | null;
  postalCode?: string | null;
  addressLn1?: string | null;
  addressLn2?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  taxNumber?: string | null;
  vatPayerNumber?: string | null;
  socialSecurityPayerNumber?: string | null;
  taxPayerScheme?: string | null;
  registrationDate: string;
}

// Employee Types
export interface SampleEmployeeDto {
  id: number;
  customerId: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  client?: string | null;
}

export interface SampleEmployeePreviewDto {
  id: number;
  customerId: number;
  fullName?: string | null;
  email?: string | null;
}

export interface CreateSampleEmployeeCommand {
  customerId: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface UpdateSampleEmployeeCommand {
  id: number;
  customerId: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

// Query Parameters
export interface CustomerQueryParams {
  Code?: string;
  Name?: string;
  SortBy?: string;
  SortDirection?: SortDirections;
  Page?: number;
  PageSize?: number;
}

export interface EmployeeQueryParams {
  CustomerId?: number;
  FullName?: string;
  Email?: string;
  SortBy?: string;
  SortDirection?: SortDirections;
  Page?: number;
  PageSize?: number;
  SortDescending?: boolean;
}
