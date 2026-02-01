import axios from "axios";
import { API_BASE_URL } from "../app/config";

console.log("API_BASE_URL:", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export default api;
