import { create } from 'zustand';

interface UIState {
  isCreateBoardOpen: boolean;
  isCreateWorkspaceOpen: boolean;

  // Actions
  toggleCreateBoard: (open: boolean) => void;
  toggleCreateWorkspace: (open: boolean) => void;
  
  // Shortcuts
  openCreateBoard: () => void;
  openCreateWorkspace: () => void;
  closeAllModals: () => void;
}

/**
 * Global UI Store for managing application-wide interface states.
 * This allows components like the Header to trigger actions in distant components.
 */
export const useUIStore = create<UIState>()((set) => ({
  isCreateBoardOpen: false,
  isCreateWorkspaceOpen: false,

  toggleCreateBoard: (open) => set({ isCreateBoardOpen: open }),
  toggleCreateWorkspace: (open) => set({ isCreateWorkspaceOpen: open }),
  
  openCreateBoard: () => set({ isCreateBoardOpen: true, isCreateWorkspaceOpen: false }),
  openCreateWorkspace: () => set({ isCreateWorkspaceOpen: true, isCreateBoardOpen: false }),
  closeAllModals: () => set({ isCreateBoardOpen: false, isCreateWorkspaceOpen: false }),
}));
