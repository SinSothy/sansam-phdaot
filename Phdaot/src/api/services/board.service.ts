import { apiCore } from "../core";
import { CreateBoardDto, Board } from "../types";

/**
 * Board API Service
 * Handles communication with the /boards endpoint using the typed core.
 * apiCore.post automatically wraps the payload in { header, body } and unwraps the response.
 */
export const boardService = {
  /**
   * Create a new board.
   */
  async createBoard(boardData: CreateBoardDto): Promise<Board> {
    return apiCore.post<CreateBoardDto, Board>("/boards/create", boardData);
  },

  /**
   * List boards for a specific workspace.
   */
  async listBoards(workspaceId: string): Promise<Board[]> {
    return apiCore.post<{ workspace_id: string }, Board[]>("/boards/list", { workspace_id: workspaceId });
  },

  /**
   * Get a board by ID.
   */
  async getBoard(id: string): Promise<Board> {
    return apiCore.post<{ id: string }, Board>("/boards/get", { id });
  },

  /**
   * Update a board.
   */
  async updateBoard(id: string, updates: Partial<CreateBoardDto>): Promise<Board> {
    return apiCore.post<{ id: string } & Partial<CreateBoardDto>, Board>("/boards/update", { id, ...updates });
  },

  /**
   * Delete a board.
   */
  async deleteBoard(id: string): Promise<void> {
    await apiCore.post<{ id: string }, void>("/boards/delete", { id });
  },
};
