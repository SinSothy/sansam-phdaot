import { workspaceService } from "../services/workspace.service";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import { Workspace } from "../types";
import { toast } from "sonner";

/**
 * Workspace Manager Layer (Business Logic)
 * Sits between UI and API.
 */
export const workspaceManager = {
  /**
   * Update a workspace and update the store.
   */
  async updateWorkspace(workspaceData: Partial<Workspace> & { id: string }) {
    const { setWorkspaces, workspaces } = useWorkspaceStore.getState();
    try {
      const updatedWorkspace = await workspaceService.updateWorkspace(workspaceData);
      
      // Update local store
      const updatedList = workspaces.map(ws => 
        ws.id === updatedWorkspace.id ? { ...ws, ...updatedWorkspace } : ws
      );
      setWorkspaces(updatedList);
      
      toast.success("Workspace updated successfully");
      return updatedWorkspace;
    } catch (error: any) {
      toast.error(error.message || "Failed to update workspace");
      throw error;
    }
  },

  /**
   * Delete a workspace and update the store.
   */
  async deleteWorkspace(id: string) {
    const { setWorkspaces, workspaces } = useWorkspaceStore.getState();
    try {
      await workspaceService.deleteWorkspace(id);
      
      // Update local store
      const updatedList = workspaces.filter(ws => ws.id !== id);
      setWorkspaces(updatedList);
      
      toast.success("Workspace deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete workspace");
      throw error;
    }
  },

  /**
   * Fetch workspace members.
   */
  async fetchWorkspaceMembers(id: string) {
    try {
      return await workspaceService.getWorkspaceMembers(id);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch workspace members");
      throw error;
    }
  }
};
