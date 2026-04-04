import { boardService } from "../services/board.service";
import { workspaceService } from "../services/workspace.service";
import { useBoardStore } from "../store/useBoardStore";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import { CreateBoardDto } from "../types";
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
   * Fetch workspaces and update store.
   */
  async fetchWorkspaces() {
    const { setLoadingWorkspaces, setWorkspaces, setWorkspaceError } = useWorkspaceStore.getState();
    setLoadingWorkspaces(true);
    try {
      const workspaces = await workspaceService.listWorkspaces();
      setWorkspaces(workspaces);
      return workspaces;
    } catch (error: any) {
      setWorkspaceError(error.message || "Failed to fetch workspaces");
      throw error;
    } finally {
      setLoadingWorkspaces(false);
    }
  },
};
