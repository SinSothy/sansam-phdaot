import { socketClient } from "../socket.client";
import { useTaskStore } from "../store/useTaskStore";
import { Task, TaskStatus, BoardColumn } from "../types";
import { boardService } from "../services/board.service";
import { toast } from "sonner";

/**
 * Task Manager Layer (Business Logic)
 * Standardized for scalability, handles real-time Socket.IO events.
 */
export const taskManager = {
  /**
   * Fetch columns for a board and update store.
   */
  async fetchBoardColumns(boardId: string) {
    const { setLoading, setBoardData, setError } = useTaskStore.getState();
    setLoading(true);
    try {
      // BoardsService findOne now returns columns and tasks
      const board = await boardService.getBoard(boardId);
      setBoardData(board.columns || []);
      return board.columns;
    } catch (error: any) {
      setError(error.message || "Failed to fetch board data");
      throw error;
    } finally {
      setLoading(false);
    }
  },

  /**
   * Initialize real-time listeners for task-related events.
   */
  listenToTaskUpdates() {
    const socket = socketClient.socket;
    if (!socket) return;

    socket.off("task:created").on("task:created", (data: { task: Task }) => {
      const { addTask } = useTaskStore.getState();
      addTask(data.task.status, data.task);
    });

    socket.off("task:updated").on("task:updated", (data: { task: Task }) => {
      const { updateTask } = useTaskStore.getState();
      updateTask(data.task.status, data.task.id, data.task);
    });

    socket.off("task:moved").on("task:moved", (data: { taskId: string; sourceStatus: TaskStatus; destStatus: TaskStatus; newIndex: number }) => {
      const { moveTask } = useTaskStore.getState();
      moveTask(data.taskId, data.sourceStatus, data.destStatus, data.newIndex);
    });

    socket.off("task:deleted").on("task:deleted", (data: { taskId: string; status: TaskStatus }) => {
      const { removeTask } = useTaskStore.getState();
      removeTask(data.status, data.taskId);
    });

    socket.off("column:created").on("column:created", (data: { column: BoardColumn }) => {
      const { addColumn } = useTaskStore.getState();
      addColumn(data.column);
    });

    socket.off("column:deleted").on("column:deleted", (data: { columnId: string }) => {
      const { removeColumn } = useTaskStore.getState();
      removeColumn(data.columnId);
    });
  },

  /**
   * Subscribe to board specific updates.
   */
  async subscribeToBoard(boardId: string) {
    socketClient.socket?.emit("subscribe_board", { boardId });
    this.listenToTaskUpdates();
  },

  /**
   * Create a new column (Optimistic).
   */
  async createColumn(boardId: string, title: string) {
    const { addColumn } = useTaskStore.getState();
    const tempId = `col-temp-${Date.now()}`;
    const newColumn: BoardColumn = {
      id: tempId,
      title,
      status: TaskStatus.TODO, // Default or dynamic
      tasks: [],
    };

    addColumn(newColumn);

    try {
      const savedCol = await socketClient.emitAsync<BoardColumn>("column:create", { boardId, title });
      const { removeColumn, addColumn: addRealCol } = useTaskStore.getState();
      removeColumn(tempId);
      addRealCol(savedCol);
      return savedCol;
    } catch (error: any) {
      const { removeColumn } = useTaskStore.getState();
      removeColumn(tempId);
      toast.error("Failed to create column");
      throw error;
    }
  },

  /**
   * Delete a column.
   */
  async deleteColumn(boardId: string, columnId: string) {
    const { removeColumn } = useTaskStore.getState();
    removeColumn(columnId);

    try {
      await socketClient.emitAsync("column:delete", { boardId, columnId });
    } catch (error: any) {
      toast.error("Failed to delete column");
    }
  },


  /**
   * Create a new task.
   */
  async createTask(boardId: string, status: TaskStatus, title: string) {
    const { addTask } = useTaskStore.getState();
    const tempId = `temp-${Date.now()}`;
    
    const newTask: Task = {
      id: tempId,
      title,
      status,
      board_id: boardId,
      order_position: 0, // Should be calculated
    };

    // Optimistic Update
    addTask(status, newTask);

    try {
      const savedTask = await socketClient.emitAsync<Task>("task:create", { 
        boardId, 
        status, 
        title 
      });
      // Replace temp task with real one
      const { removeTask, addTask: addRealTask } = useTaskStore.getState();
      removeTask(status, tempId);
      addRealTask(status, savedTask);
      return savedTask;
    } catch (error: any) {
      const { removeTask } = useTaskStore.getState();
      removeTask(status, tempId);
      toast.error(error.message || "Failed to create task");
      throw error;
    }
  },

  /**
   * Move a task (Optimistic).
   */
  async moveTask(taskId: string, sourceStatus: TaskStatus, destStatus: TaskStatus, newIndex: number) {
    const { moveTask } = useTaskStore.getState();
    
    // Save previous state for rollback? (Usually handled by re-fetching on error)
    moveTask(taskId, sourceStatus, destStatus, newIndex);

    try {
      await socketClient.emitAsync("task:move", { 
        taskId, 
        sourceStatus, 
        destStatus, 
        newIndex 
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to move task. Re-syncing...");
      // In a real app, we would re-fetch the board data here to ensure consistency
    }
  },

  /**
   * Update task title.
   */
  async updateTaskTitle(taskId: string, status: TaskStatus, title: string) {
    const { updateTask } = useTaskStore.getState();
    updateTask(status, taskId, { title });

    try {
      await socketClient.emitAsync("task:update", { taskId, title });
    } catch (error: any) {
      toast.error("Failed to update task");
    }
  },

  /**
   * Delete a task.
   */
  async deleteTask(taskId: string, status: TaskStatus) {
    const { removeTask } = useTaskStore.getState();
    removeTask(status, taskId);

    try {
      await socketClient.emitAsync("task:delete", { taskId });
      toast.success("Task deleted");
    } catch (error: any) {
      toast.error("Failed to delete task");
    }
  }
};
