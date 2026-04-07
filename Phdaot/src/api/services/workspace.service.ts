import { apiCore } from "../core";
import { Workspace, CreateWorkspaceRequest } from "../types";

/**
 * Workspace API Service
 * Handles communication with the /workspaces endpoint using the typed core.
 */
export const workspaceService = {
  /**
   * Create a new workspace.
   */
  async createWorkspace(workspaceData: CreateWorkspaceRequest): Promise<Workspace> {
    return apiCore.post<CreateWorkspaceRequest, Workspace>("/workspaces/create", workspaceData);
  },

  /**
   * List all workspaces for the current user.
   */
  async listWorkspaces(): Promise<Workspace[]> {
    // Note: Standardizing to POST as per backend requirement for base envelopes
    return apiCore.post<any, Workspace[]>("/workspaces/list", {});
  },

  /**
   * Update a workspace.
   */
  async updateWorkspace(workspaceData: Partial<Workspace> & { id: string }): Promise<Workspace> {
    return apiCore.post<Partial<Workspace> & { id: string }, Workspace>("/workspaces/update", workspaceData);
  },

  /**
   * Delete a workspace.
   */
  async deleteWorkspace(id: string): Promise<void> {
    await apiCore.post<{ id: string }, void>("/workspaces/delete", { id });
  },

  /**
   * Get workspace members.
   */
  async getWorkspaceMembers(id: string): Promise<any[]> {
    return apiCore.post<{ id: string }, any[]>("/workspaces/members", { id });
  },
};
