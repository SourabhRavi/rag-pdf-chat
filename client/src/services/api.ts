import { ApiError } from "@/services/api-error";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 300000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;

      const message = error.response?.data?.message ?? "Something went wrong. Please try again.";

      throw new ApiError(message, status);
    }

    throw error;
  },
);
