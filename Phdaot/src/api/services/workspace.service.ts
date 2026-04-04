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
   * Get a workspace by ID.
   */
  async getWorkspace(id: string): Promise<Workspace> {
    return apiCore.post<{ id: string }, Workspace>("/workspaces/get", { id });
  },
};
