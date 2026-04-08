import { workspaceService } from "../services/workspace.service";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import { Workspace } from "../types";
import { toast } from "sonner";
import { socketClient } from "../socket.client";

/**
 * Workspace Manager Layer (Business Logic)
 * Sits between UI and API.
 */
export const workspaceManager = {
  /**
   * Initialize WebSocket listeners for workspaces.
   */
  setupSocketListeners() {
    const socket = socketClient.socket;
    if (!socket) return;

    // 1. Workspace Created
    socket.on("workspace:created", (newWorkspace: Workspace) => {
      const { setWorkspaces, workspaces } = useWorkspaceStore.getState();
      // Check if already in list to avoid duplicates
      if (!workspaces.some(ws => ws.id === newWorkspace.id)) {
        setWorkspaces([newWorkspace, ...workspaces]);
        toast.info(`New workspace "${newWorkspace.name}" created`);
      }
    });

    // 2. Workspace Updated
    socket.on("workspace:updated", (updatedWorkspace: Workspace) => {
      const { setWorkspaces, workspaces } = useWorkspaceStore.getState();
      const updatedList = workspaces.map(ws => 
        ws.id === updatedWorkspace.id ? { ...ws, ...updatedWorkspace } : ws
      );
      setWorkspaces(updatedList);
      toast.info(`Workspace "${updatedWorkspace.name}" was updated`);
    });

    // 3. Workspace Deleted
    socket.on("workspace:deleted", (data: { id: string }) => {
      const { setWorkspaces, workspaces } = useWorkspaceStore.getState();
      const workspaceToDelete = workspaces.find(ws => ws.id === data.id);
      const updatedList = workspaces.filter(ws => ws.id !== data.id);
      setWorkspaces(updatedList);
      
      if (workspaceToDelete) {
        toast.warning(`Workspace "${workspaceToDelete.name}" was deleted`);
      }
    });
  },

  /**
   * Update a workspace and update the store.
   */
  async updateWorkspace(workspaceData: Partial<Workspace> & { id: string }) {
    const { setWorkspaces, workspaces } = useWorkspaceStore.getState();
    try {
      const updatedWorkspace = await workspaceService.updateWorkspace(workspaceData);
      
      // Update local store (Optimistic/Immediate)
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
