import api from "../../services/api";

// Types
export interface EnumValue {
  [key: string]: any;
}

// API Functions

let enumNamesCache: string[] | null = null;
let enumNamesPending: Promise<string[]> | null = null;
export const getEnumNames = async (): Promise<string[]> => {
  if (enumNamesCache) return enumNamesCache;
  if (enumNamesPending) return enumNamesPending;
  enumNamesPending = api
    .get<string[]>("/api/Enums")
    .then((response) => {
      enumNamesCache = response.data;
      enumNamesPending = null;
      return response.data;
    })
    .catch((err) => {
      enumNamesPending = null;
      throw err;
    });
  return enumNamesPending;
};

const enumValuesCache: { [key: string]: EnumValue[] } = {};
const enumValuesPending: { [key: string]: Promise<EnumValue[]> } = {};
export const getEnumValues = async (enumName: string): Promise<EnumValue[]> => {
  if (enumValuesCache[enumName]) return enumValuesCache[enumName];
  if (enumValuesPending[enumName]) return enumValuesPending[enumName];
  const promise = api
    .get<EnumValue[]>(`/api/Enums/${enumName}`)
    .then((response) => {
      enumValuesCache[enumName] = response.data;
      delete enumValuesPending[enumName];
      return response.data;
    })
    .catch((err) => {
      delete enumValuesPending[enumName];
      throw err;
    });
  enumValuesPending[enumName] = promise;
  return promise;
};
