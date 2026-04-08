import { boardService } from "../services/board.service";
import { workspaceService } from "../services/workspace.service";
import { useBoardStore } from "../store/useBoardStore";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import { CreateBoardDto, CreateWorkspaceRequest, Workspace } from "../types";
import { toast } from "sonner";
import { socketClient } from "../socket.client";

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
   * Refactored to use WebSockets for high-performance initial loading.
   * Senior Choice: Using Socket acknowledgment for request-response over persistent connection.
   */
  async fetchDashboardData() {
    const { setLoadingWorkspaces, setWorkspaces, setWorkspaceError } = useWorkspaceStore.getState();
    setLoadingWorkspaces(true);
    try {
      // @SeniorOptimization: Fetch via Socket.IO with acknowledgment
      const response = await socketClient.emitAsync<Workspace[]>("list_workspaces", {});
      
      // The socketClient.emitAsync already handles the .data unwrapping if it's a standardized envelope
      setWorkspaces(response);
      
      // @SeniorOptimization: Join all workspace rooms for real-time board updates
      response.forEach(workspace => {
        socketClient.socket?.emit("subscribe_workspace", { workspaceId: workspace.id });
      });
      
      // Re-initialize listeners to ensure real-time updates are active
      this.listenToDashboardUpdates();
      
      return response;
    } catch (error: any) {
      setWorkspaceError(error.message || "Failed to fetch dashboard data via WebSocket");
      throw error;
    } finally {
      setLoadingWorkspaces(false);
    }
  },

  /**
   * Real-time listeners for dashboard updates.
   * Ensures the store is reactive to workspace and board changes globally.
   */
  listenToDashboardUpdates() {
    const socket = socketClient.socket;
    if (!socket) return;

    // Listen for workspace creations
    socket.off("workspace:created").on("workspace:created", (workspace: Workspace) => {
      const { addWorkspace } = useWorkspaceStore.getState();
      addWorkspace(workspace);
    });

    // Listen for workspace updates/delections if needed
    socket.off("workspace:updated").on("workspace:updated", (updatedWorkspace: Workspace) => {
      const { workspaces, setWorkspaces } = useWorkspaceStore.getState();
      const newWorkspaces = workspaces.map(w => 
        w.id === updatedWorkspace.id ? { ...w, ...updatedWorkspace } : w
      );
      setWorkspaces(newWorkspaces);
    });

    // @SeniorOptimization: Handle board updates directly for the dashboard view
    socket.off("board:created").on("board:created", (newBoard: any) => {
      const { workspaces, setWorkspaces } = useWorkspaceStore.getState();
      const newList = workspaces.map(w => {
        if (w.id === newBoard.workspace_id) {
          const boards = w.boards || [];
          if (!boards.some(b => b.id === newBoard.id)) {
            return { ...w, boards: [...boards, newBoard] };
          }
        }
        return w;
      });
      setWorkspaces(newList);
    });
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
