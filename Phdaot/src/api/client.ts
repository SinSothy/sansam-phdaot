import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiResponse } from "./types";

import { handleApiError } from "./error.handler";

/**
 * Enterprise API Client Configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Currently minimal, but can handle global things like Authorization headers.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available (cookie is usually handled by withCredentials,
    // but JWT headers would go here).
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * Handles various global error states and unwraps the NestJS TransformInterceptor response.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Return the data field directly to the caller, while keeping meta info available if needed
    // In many large projects, we unwrap here to simplify service-level code.
    return response.data as any;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 1. Handle Token Refresh logic (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/auth/refresh");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }

    // 2. Globally Handle all other errors via the Centralized Error Handler
    // This triggers the Toast UI for any failure.
    handleApiError(error);

    return Promise.reject(error);
  },
);

export default apiClient;
