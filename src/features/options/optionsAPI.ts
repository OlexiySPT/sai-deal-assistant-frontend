import api from "../../services/api";

export interface StringOptionsQuery {
  entityType: string;
  fieldName: string;
  sortDirection?: string;
}

// Per-entity/field/sortDirection in-memory cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
type OptionsCacheEntry = { data: string[]; timestamp: number };
const optionsCache: Record<string, OptionsCacheEntry> = {};
const pending: Record<string, Promise<string[]> | undefined> = {};

function getCacheKey(
  entityType: string,
  fieldName: string,
  sortDirection?: string,
) {
  return `${entityType}~~~${fieldName}~~~${sortDirection || ""}`;
}

/**
 * Fetch string options for a given entity type and field name, with per-key cache.
 * GET /api/StringOptions
 */
export async function getCachedStringOptions(
  params: StringOptionsQuery,
): Promise<string[]> {
  const { entityType, fieldName, sortDirection } = params;
  if (!entityType || !fieldName)
    throw new Error("entityType and fieldName are required");
  const cacheKey = getCacheKey(entityType, fieldName, sortDirection);
  const now = Date.now();
  const cached = optionsCache[cacheKey];
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  if (pending[cacheKey]) return pending[cacheKey]!;
  const query: any = { entityType, fieldName };
  if (sortDirection) query.sortDirection = sortDirection;
  pending[cacheKey] = api
    .get<string[]>("/api/StringOptions", { params: query })
    .then((response) => {
      optionsCache[cacheKey] = { data: response.data, timestamp: Date.now() };
      pending[cacheKey] = undefined;
      return response.data;
    })
    .catch((err) => {
      pending[cacheKey] = undefined;
      throw err;
    });
  return pending[cacheKey]!;
}
