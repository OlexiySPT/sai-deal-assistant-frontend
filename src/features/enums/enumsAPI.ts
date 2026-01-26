import api from "../../services/api";

// Types
export interface EnumValue {
  [key: string]: any;
}

// API Functions
export const getEnumNames = async (): Promise<string[]> => {
  const response = await api.get<string[]>("/api/Enums");
  return response.data;
};

export const getEnumValues = async (enumName: string): Promise<EnumValue[]> => {
  const response = await api.get<EnumValue[]>(`/api/Enums/${enumName}`);
  return response.data;
};
