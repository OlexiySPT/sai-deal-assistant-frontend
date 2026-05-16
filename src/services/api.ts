import axios from "axios";
import { API_BASE_URL } from "../app/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null, // This will serialize arrays as: StateIds=1&StateIds=2 instead of StateIds[]=1
  },
});

api.interceptors.request.use((config) => {
  if (
    typeof config.url === "string" &&
    config.baseURL?.endsWith("/api") &&
    config.url.startsWith("/api/")
  ) {
    config.url = config.url.replace(/^\/api/, "");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export default api;
