import apiClient from "./client";
import { Platform, RequestHeader, BaseRequest, ApiResponse } from "./types";
import { API_CONFIG } from "./api.config";
import { handleApiError } from "./error.handler";
import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Enterprise API Core
 * A generic, typed wrapper around the raw apiClient.
 * Handles automatic request/response wrapping/unwrapping and global error logic.
 */
export const apiCore = {
  /**
   * Primary Generic Request Handler
   */
  async request<TRequest, TResponse>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      // 1. Build Standardized Request Envelope
      // userID is retrieved from localStorage as a fallback to demonstrate integration.
      // In a full Auth implementation, this would come from an Auth Store (e.g. Zustand).
      let userID = "d933b066-f00a-4402-a782-c731a481c823";
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem(API_CONFIG.AUTH_STORAGE_KEY);
        if (storedUser) {
          try {
            userID = JSON.parse(storedUser).id || userID;
          } catch (e) {
            /* ignore */
          }
        }
      }

      const header: RequestHeader = {
        platform: API_CONFIG.PLATFORM as Platform,
        userID,
        requestID: `req-${Date.now()}`,
        version: API_CONFIG.VERSION,
        tz:
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          API_CONFIG.DEFAULT_TIMEZONE,
      };

      const baseRequest: BaseRequest<TRequest> = {
        header,
        body: data as TRequest,
      };

      // 2. Execute Request through apiClient
      // Note: For 'get' requests, we might still send the header if the backend requires it,
      // but conventionally GET uses params. Here we follow the user's "body" requirement for consistency.
      const response: AxiosResponse<ApiResponse<TResponse>> =
        await apiClient.request({
          ...config,
          method,
          url,
          data: method !== "get" ? baseRequest : undefined,
          params:
            method === "get"
              ? { ...config?.params, ...header }
              : config?.params,
        });

      // 3. Extract and return the specialized data
      // The apiClient interceptor already unwraps response.data from Axios,
      // but apiCore further unwraps the ApiResponse.data field.
      const apiResponse = response as unknown as ApiResponse<TResponse>;
      return apiResponse.data;
    } catch (error) {
      // Error is already handled globally in client.ts interceptor calling handleApiError,
      // but we re-throw to allow component-level catch blocks if needed.
      throw error;
    }
  },

  /**
   * Convenience Typed Methods
   */
  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<any, TResponse>("get", url, undefined, config);
  },

  async post<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<TRequest, TResponse>("post", url, data, config);
  },

  async put<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<TRequest, TResponse>("put", url, data, config);
  },

  async patch<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<TRequest, TResponse>("patch", url, data, config);
  },

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<any, TResponse>("delete", url, undefined, config);
  },
};
