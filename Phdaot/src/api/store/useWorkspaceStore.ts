import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Workspace } from '../types';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isLoadingWorkspaces: boolean;
  workspaceError: string | null;

  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspaceId: (id: string | null) => void;
  setLoadingWorkspaces: (isLoading: boolean) => void;
  addWorkspace: (workspace: Workspace) => void;
  setWorkspaceError: (error: string | null) => void;
}

/**
 * Workspace Store with Persistence
 */
export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      currentWorkspaceId: null,
      isLoadingWorkspaces: false,
      workspaceError: null,

      setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
      setCurrentWorkspaceId: (id: string | null) => set({ currentWorkspaceId: id }),
      setLoadingWorkspaces: (isLoading: boolean) => set({ isLoadingWorkspaces: isLoading }),
      addWorkspace: (workspace: Workspace) => set((state) => ({ workspaces: [...state.workspaces, workspace] })),
      setWorkspaceError: (error: string | null) => set({ workspaceError: error }),
    }),
    {
      name: 'workspace-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
