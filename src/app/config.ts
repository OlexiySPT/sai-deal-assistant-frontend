const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Endpoints already include /api/... in feature API modules.
// Keep base URL origin-only (or empty for same-origin) to avoid /api/api/... requests.
export const API_BASE_URL = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/+$/, "")
  : "";
