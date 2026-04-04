import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Board } from '../types';

interface BoardState {
  boards: Board[];
  selectedBoardId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  removeBoard: (id: string) => void;
  setSelectedBoardId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Board Store with Persistence
 */
export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: [],
      selectedBoardId: null,
      isLoading: false,
      error: null,

      setBoards: (boards: Board[]) => set({ boards }),
      addBoard: (board: Board) => set((state: BoardState) => ({ 
        boards: [...state.boards, board] 
      })),
      updateBoard: (id: string, updates: Partial<Board>) => set((state: BoardState) => ({
        boards: state.boards.map((b) => b.id === id ? { ...b, ...updates } : b)
      })),
      removeBoard: (id: string) => set((state: BoardState) => ({
        boards: state.boards.filter((b) => b.id !== id)
      })),
      setSelectedBoardId: (id: string | null) => set({ selectedBoardId: id }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'board-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
