import apiClient from "../client";
import { CreateBoardDto, Board } from "../types";

/**
 * Board API Service
 * Handles communication with the /boards endpoint.
 * Note: apiClient automatically wraps the payload in { header, body } for POST requests.
 */
export const boardService = {
  /**
   * Create a new board.
   */
  async createBoard(boardData: CreateBoardDto): Promise<Board> {
    const response = await apiClient.post("/boards/create", boardData);
    // apiClient unwraps the ApiResponse, so response is the data field (Board)
    return response as unknown as Board;
  },

  /**
   * List boards for a specific workspace.
   */
  async listBoards(workspaceId: string): Promise<Board[]> {
    const response = await apiClient.post("/boards/list", { workspace_id: workspaceId });
    return response as unknown as Board[];
  },

  /**
   * Get a board by ID.
   */
  async getBoard(id: string): Promise<Board> {
    const response = await apiClient.post("/boards/get", { id });
    return response as unknown as Board;
  },

  /**
   * Update a board.
   */
  async updateBoard(id: string, updates: Partial<CreateBoardDto>): Promise<Board> {
    const response = await apiClient.post("/boards/update", { id, ...updates });
    return response as unknown as Board;
  },

  /**
   * Delete a board.
   */
  async deleteBoard(id: string): Promise<void> {
    await apiClient.post("/boards/delete", { id });
  },
};
