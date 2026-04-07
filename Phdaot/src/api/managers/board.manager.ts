import { boardService } from "../services/board.service";
import { workspaceService } from "../services/workspace.service";
import { useBoardStore } from "../store/useBoardStore";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import { CreateBoardDto, CreateWorkspaceRequest } from "../types";
import { toast } from "sonner";

/**
 * Board Manager Layer (Business Logic)
 * Sits between UI and API.
 */
export const boardManager = {
  /**
   * Fetch boards for a specific workspace and update store.
   */
  async fetchBoards(workspaceId: string) {
    const { setLoading, setBoards, setError } = useBoardStore.getState();
    setLoading(true);
    try {
      const boards = await boardService.listBoards(workspaceId);
      setBoards(boards);
      return boards;
    } catch (error: any) {
      setError(error.message || "Failed to fetch boards");
      throw error;
    } finally {
      setLoading(false);
    }
  },

  /**
   * Create a new board and update store.
   */
  async createBoard(boardData: CreateBoardDto) {
    const { setLoading, addBoard, setError } = useBoardStore.getState();
    setLoading(true);
    try {
      const newBoard = await boardService.createBoard(boardData);
      addBoard(newBoard);
      toast.success("Board created successfully");
      return newBoard;
    } catch (error: any) {
      setError(error.message || "Failed to create board");
      // Toast error is already handled by apiClient's error handler (error.handler.ts)
      throw error;
    } finally {
      setLoading(false);
    }
  },

  /**
   * Fetch dashboard data (workspaces + boards).
   * Refactored to a single unified call for performance (Senior recommendation).
   */
  async fetchDashboardData() {
    const { setLoadingWorkspaces, setWorkspaces, setWorkspaceError } = useWorkspaceStore.getState();
    setLoadingWorkspaces(true);
    try {
      // Assuming the backend workspace API is optimized to return nested boards.
      const workspaces = await workspaceService.listWorkspaces();
      setWorkspaces(workspaces);
      return workspaces;
    } catch (error: any) {
      setWorkspaceError(error.message || "Failed to fetch dashboard data");
      throw error;
    } finally {
      setLoadingWorkspaces(false);
    }
  },

  /**
   * Fetch workspaces (legacy/standalone).
   */
  async fetchWorkspaces() {
    return this.fetchDashboardData();
  },
  /**
   * Create a new workspace and update store.
   */
  async createWorkspace(workspaceData: CreateWorkspaceRequest) {
    const { setLoadingWorkspaces, addWorkspace, setWorkspaceError } = useWorkspaceStore.getState();
    setLoadingWorkspaces(true);
    try {
      const newWorkspace = await workspaceService.createWorkspace(workspaceData);
      addWorkspace(newWorkspace);
      toast.success("Workspace created successfully");
      return newWorkspace;
    } catch (error: any) {
      setWorkspaceError(error.message || "Failed to create workspace");
      throw error;
    } finally {
      setLoadingWorkspaces(false);
    }
  },
};
