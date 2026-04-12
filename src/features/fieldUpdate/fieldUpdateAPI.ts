import api from "../../services/api";

export interface UpdateStringFieldCommand {
  entity?: string | null;
  field?: string | null;
  id: number;
  value?: string | null;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
}

export interface UpdateNumericFieldCommand {
  entity?: string | null;
  field?: string | null;
  id: number;
  value?: number | null;
  notNull: boolean;
}

export interface UpdateDateOnlyFieldCommand {
  entity?: string | null;
  field?: string | null;
  id: number;
  value?: string | null; // ISO date string
  notNull: boolean;
}

export interface UpdateDateTimeOffsetFieldCommand {
  entity?: string | null;
  field?: string | null;
  id: number;
  value?: string | null; // ISO date-time string
  notNull: boolean;
}

export interface FieldUpdate {
  field: string | null;
  value: any;
}

export interface UpdateMultipleFieldsCommand {
  entity?: string | null;
  id: number;
  fields: FieldUpdate[];
}

export const fieldUpdateAPI = {
  updateString: (data: UpdateStringFieldCommand) =>
    api.put<string>("/api/FieldUpdate/string", data),

  updateNumeric: (data: UpdateNumericFieldCommand) =>
    api.put<number | null>("/api/FieldUpdate/numeric", data),

  updateDate: (data: UpdateDateOnlyFieldCommand) =>
    api.put<string | null>("/api/FieldUpdate/date", data),

  updateDateTime: (data: UpdateDateTimeOffsetFieldCommand) =>
    api.put<string | null>("/api/FieldUpdate/date-time", data),

  updateMultiple: (data: UpdateMultipleFieldsCommand) =>
    api.put<Record<string, any>>("/api/FieldUpdate/multi", data),
};

export default fieldUpdateAPI;
