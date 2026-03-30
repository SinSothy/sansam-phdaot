import apiClient from "../client";

/**
 * Enterprise Auth Service
 * Uses centralized apiClient with custom headers to communicate with the Auth API.
 */
export const authService = {
  /**
   * Log in a user with credentials.
   * On success, the backend sets an HttpOnly cookie.
   */
  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * Refresh the access/session token.
   * This is called automatically by the Axios interceptor on a 401 error.
   */
  async refreshToken() {
    const response = await apiClient.post("/auth/refresh");
    return response.data;
  },

  /**
   * Log the user out and clear the backend session/cookies.
   */
  async logout() {
    await apiClient.post("/auth/logout");
  },

  /**
   * Fetch the current authenticated user's profile.
   */
  async getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
