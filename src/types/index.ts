// Common Types
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

export type SortDirections = "Asc" | "Desc";
