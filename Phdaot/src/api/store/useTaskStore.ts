import { create } from 'zustand';
import { Task, BoardColumn, TaskStatus } from '../types';

interface TaskState {
  columns: BoardColumn[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setBoardData: (columns: BoardColumn[]) => void;
  addColumn: (column: BoardColumn) => void;
  removeColumn: (columnId: string) => void;
  addTask: (status: TaskStatus, task: Task) => void;

  updateTask: (status: TaskStatus, taskId: string, updates: Partial<Task>) => void;
  removeTask: (status: TaskStatus, taskId: string) => void;
  moveTask: (taskId: string, sourceStatus: TaskStatus, destStatus: TaskStatus, newIndex: number) => void;
  moveColumn: (startIndex: number, endIndex: number) => void;
  updateColumnTitle: (status: TaskStatus, title: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Task Store for Kanban Board
 * Manages columns and tasks for the active board.
 */
export const useTaskStore = create<TaskState>((set) => ({
  columns: [],
  isLoading: false,
  error: null,

  setBoardData: (columns) => set({ columns }),
  
  addColumn: (column) => set((state) => ({
    columns: [...state.columns, column]
  })),

  removeColumn: (columnId) => set((state) => ({
    columns: state.columns.filter((col) => col.id !== columnId)
  })),

  addTask: (status, task) => set((state) => ({
    columns: state.columns.map((col) => 
      col.status === status ? { ...col, tasks: [...(col.tasks || []), task] } : col
    )
  })),

  updateTask: (status, taskId, updates) => set((state) => ({
    columns: state.columns.map((col) => 
      col.status === status 
        ? { ...col, tasks: (col.tasks || []).map((t) => t.id === taskId ? { ...t, ...updates } : t) } 
        : col
    )
  })),

  removeTask: (status, taskId) => set((state) => ({
    columns: state.columns.map((col) => 
      col.status === status 
        ? { ...col, tasks: (col.tasks || []).filter((t) => t.id !== taskId) } 
        : col
    )
  })),

  moveTask: (taskId, sourceStatus, destStatus, newIndex) => set((state) => {
    const newColumns = [...state.columns];
    const sourceColIndex = newColumns.findIndex((col) => col.status === sourceStatus);
    const destColIndex = newColumns.findIndex((col) => col.status === destStatus);

    if (sourceColIndex === -1 || destColIndex === -1) return state;

    const sourceCol = { ...newColumns[sourceColIndex], tasks: [...(newColumns[sourceColIndex].tasks || [])] };
    const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return state;

    const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);
    
    // Update task status if moving between columns
    if (sourceStatus !== destStatus) {
      movedTask.status = destStatus;
    }

    if (sourceStatus === destStatus) {
      sourceCol.tasks.splice(newIndex, 0, movedTask);
      newColumns[sourceColIndex] = sourceCol;
    } else {
      const destCol = { ...newColumns[destColIndex], tasks: [...(newColumns[destColIndex].tasks || [])] };
      destCol.tasks.splice(newIndex, 0, movedTask);
      newColumns[sourceColIndex] = sourceCol;
      newColumns[destColIndex] = destCol;
    }

    return { columns: newColumns };
  }),

  moveColumn: (startIndex, endIndex) => set((state) => {
    const newColumns = Array.from(state.columns);
    const [removed] = newColumns.splice(startIndex, 1);
    newColumns.splice(endIndex, 0, removed);
    return { columns: newColumns };
  }),

  updateColumnTitle: (status, title) => set((state) => ({
    columns: state.columns.map((col) => 
      col.status === status ? { ...col, title } : col
    )
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
