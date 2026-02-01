import api from "../../services/api";

// Types
export interface EnumValue {
  [key: string]: any;
}

// API Functions

let enumNamesCache: string[] | null = null;
export const getEnumNames = async (): Promise<string[]> => {
  if (enumNamesCache) return enumNamesCache;
  const response = await api.get<string[]>("/api/Enums");
  enumNamesCache = response.data;
  return response.data;
};

const enumValuesCache: { [key: string]: EnumValue[] } = {};
export const getEnumValues = async (enumName: string): Promise<EnumValue[]> => {
  if (enumValuesCache[enumName]) return enumValuesCache[enumName];
  const response = await api.get<EnumValue[]>(`/api/Enums/${enumName}`);
  enumValuesCache[enumName] = response.data;
  return response.data;
};
