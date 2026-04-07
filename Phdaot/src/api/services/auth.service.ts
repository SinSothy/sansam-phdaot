import { apiCore } from "../core";

/**
 * Enterprise Auth Service
 * Uses standardized apiCore to communicate with the Auth API.
 * apiCore handles the { header, body } wrapping and error handling.
 */
export const authService = {
  /**
   * Log in a user with credentials.
   * On success, the backend sets an HttpOnly cookie.
   */
  async login(credentials: { email: string; password: string }) {
    return apiCore.post<{ email: string; password: string }, any>("/auth/login", credentials);
  },

  /**
   * Refresh the access/session token.
   * This is called automatically by the Axios interceptor on a 401 error.
   */
  async refreshToken() {
    return apiCore.post<any, any>("/auth/refresh", {});
  },

  /**
   * Log the user out and clear the backend session/cookies.
   */
  async logout() {
    await apiCore.post<any, void>("/auth/logout", {});
  },

  /**
   * Fetch the current authenticated user's profile.
   */
  async getCurrentUser() {
    return apiCore.get<any>("/auth/me");
  },
};
