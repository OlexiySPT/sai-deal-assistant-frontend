import api from "../../services/api";

export interface UpdateStringFieldCommand {
  entity?: string;
  field?: string;
  id: number;
  value?: string;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
}

export interface UpdateNumericFieldCommand {
  entity?: string;
  field?: string;
  id: number;
  value?: number;
  notNull: boolean;
}

export interface UpdateDateFieldCommand {
  entity?: string;
  field?: string;
  id: number;
  value?: string; // ISO date string
  notNull: boolean;
}

export const fieldUpdateAPI = {
  updateString: (data: UpdateStringFieldCommand) =>
    api.put<string>("/api/FieldUpdate/string", data),

  updateNumeric: (data: UpdateNumericFieldCommand) =>
    api.put<number | null>("/api/FieldUpdate/numeric", data),

  updateDate: (data: UpdateDateFieldCommand) =>
    api.put<string | null>("/api/FieldUpdate/date", data),
};

export default fieldUpdateAPI;
