import axios from "axios";
import { getConfig } from "../config/config";

const api = axios.create({
  baseURL: "https://localhost:719-6", // Default, will be overridden after config loads
  headers: {
    "Content-Type": "application/json",
  },
});

// Update baseURL after config is loaded
export const initializeApi = () => {
  const config = getConfig();
  api.defaults.baseURL = config.apiBaseUrl;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
