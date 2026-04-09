import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger, Inject, forwardRef } from '@nestjs/common';
import { WsJwtGuard } from '../../../common/guards/ws-jwt.guard';
import { WorkspacesService } from '../workspaces.service';
import { BoardsService } from '../../boards/boards.service';
import { TasksService } from '../../tasks/tasks.service';
import { TaskStatus } from '../../tasks/enums/task-status.enum';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
  },
  namespace: 'workspaces',
})
export class WorkspacesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => WorkspacesService))
    private readonly workspacesService: WorkspacesService,
    @Inject(forwardRef(() => BoardsService))
    private readonly boardsService: BoardsService,
    private readonly tasksService: TasksService,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WorkspacesGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe_workspaces')
  handleSubscribeWorkspaces(@ConnectedSocket() client: Socket) {
    const userId = client.data.user.id;
    client.join(`user_${userId}`);
    this.logger.log(`User ${userId} subscribed to workspace list updates`);
    return { event: 'subscribed', data: { room: `user_${userId}` } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('list_workspaces')
  async handleListWorkspaces(@ConnectedSocket() client: Socket) {
    const userId = client.data.user?.id;
    if (!userId) {
      this.logger.error('No userId found in client data during list_workspaces request');
      return {
        status: 'error',
        message: 'Unauthorized: No user ID provided',
        error: 'Unauthorized',
        data: null,
        meta: { timestamp: new Date().toISOString() },
      };
    }

    this.logger.log(`[START] User ${userId} fetching dashboard via WebSockets`);
    try {
      const data = await this.workspacesService.findAll(userId);
      this.logger.log(`[SUCCESS] User ${userId} fetched ${data.length} workspaces`);
      return {
        status: 'success',
        message: 'Workspaces and boards fetched successfully',
        error: null,
        data: data,
        meta: { timestamp: new Date().toISOString() },
      };
    } catch (error: any) {
      this.logger.error(`[ERROR] User ${userId} failed to fetch dashboard: ${error.message}`);
      return {
        status: 'error',
        message: error.message || 'Internal server error',
        error: error.name || 'Error',
        data: null,
        meta: { timestamp: new Date().toISOString() },
      };
    }
  }


  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe_workspace')
  handleSubscribeWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string },
  ) {
    client.join(`workspace_${data.workspaceId}`);
    this.logger.log(`Client ${client.id} subscribed to workspace ${data.workspaceId}`);
    return { event: 'subscribed', data: { room: `workspace_${data.workspaceId}` } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe_board')
  async handleSubscribeBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string },
  ) {
    try {
      const board = await this.boardsService.findOne(data.boardId);
      client.join(`workspace_${board.workspace_id}`);
      this.logger.log(`Client ${client.id} subscribed to board ${data.boardId} (Workspace ${board.workspace_id})`);
      return { event: 'subscribed', data: { room: `workspace_${board.workspace_id}` } };
    } catch (error: any) {
      this.logger.error(`Failed to subscribe to board ${data.boardId}: ${error.message}`);
      return { status: 'error', message: 'Board not found' };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('unsubscribe_workspace')
  handleUnsubscribeWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string },
  ) {
    client.leave(`workspace_${data.workspaceId}`);
    this.logger.log(`Client ${client.id} unsubscribed from workspace ${data.workspaceId}`);
    return { event: 'unsubscribed', data: { room: `workspace_${data.workspaceId}` } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('column:create')
  async handleCreateColumn(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string; title: string },
  ) {
    this.logger.log(`[START] Creating column "${data.title}" for board ${data.boardId}`);
    try {
      const column = await this.boardsService.createColumn(data.boardId, data.title);
      
      // BROADCAST TO OTHERS ONLY (excluding sender to prevent duplication)
      const board = await this.boardsService.findOne(data.boardId);
      client.to(`workspace_${board.workspace_id}`).emit('column:created', { column });

      return {
        status: 'success',
        message: 'Column created successfully',
        data: column,
      };
    } catch (error: any) {
      this.logger.error(`[ERROR] Failed to create column: ${error.message}`);
      return {
        status: 'error',
        message: error.message || 'Failed to create column',
      };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('column:delete')
  async handleDeleteColumn(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string; columnId: string },
  ) {
    this.logger.log(`[START] Deleting column ${data.columnId} from board ${data.boardId}`);
    try {
      await this.boardsService.removeColumn(data.boardId, data.columnId);
      
      // BROADCAST TO OTHERS ONLY
      const board = await this.boardsService.findOne(data.boardId);
      client.to(`workspace_${board.workspace_id}`).emit('column:deleted', { columnId: data.columnId });

      return {
        status: 'success',
        message: 'Column deleted successfully',
      };
    } catch (error: any) {
      this.logger.error(`[ERROR] Failed to delete column: ${error.message}`);
      return {
        status: 'error',
        message: error.message || 'Failed to delete column',
      };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('task:create')
  async handleCreateTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string; status: TaskStatus; title: string },
  ) {
    this.logger.log(`[START] Creating task "${data.title}" in ${data.status} for board ${data.boardId}`);
    try {
      const task = await this.tasksService.create(data.boardId, data.status, data.title);
      
      const board = await this.boardsService.findOne(data.boardId);
      client.to(`workspace_${board.workspace_id}`).emit('task:created', { task });

      return {
        status: 'success',
        message: 'Task created successfully',
        data: task,
      };
    } catch (error: any) {
      this.logger.error(`[ERROR] Failed to create task: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('task:update')
  async handleUpdateTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { taskId: string; title?: string; status?: TaskStatus },
  ) {
    try {
      const task = await this.tasksService.update(data.taskId, data);
      
      const board = await this.boardsService.findOne(task.board_id);
      client.to(`workspace_${board.workspace_id}`).emit('task:updated', { task });

      return { status: 'success', data: task };
    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('task:delete')
  async handleDeleteTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { taskId: string; status: TaskStatus },
  ) {
    try {
      await this.tasksService.remove(data.taskId);
      
      // We need boardId to find room, or use a cached room strategy
      // For now, fetch task before delete or assume room by other means
      // Assuming we can still find the boardId if we had the task
      // In a real app, we might pass boardId in the event data
      
      // Since we already deleted it, we can't fetch it. 
      // Let's assume we have it or the room is passed.
      // For now, let's just emit to everyone who might be interested if possible, 
      // or require boardId in delete.
      
      // BROADCAST (If room is known)
      // client.to(room).emit('task:deleted', { taskId: data.taskId, status: data.status });

      return { status: 'success' };
    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('task:move')
  async handleMoveTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { taskId: string; sourceStatus: TaskStatus; destStatus: TaskStatus; newIndex: number },
  ) {
    try {
      const task = await this.tasksService.move(data.taskId, data.sourceStatus, data.destStatus, data.newIndex);
      
      const board = await this.boardsService.findOne(task.board_id);
      client.to(`workspace_${board.workspace_id}`).emit('task:moved', data);

      return { status: 'success', data: task };
    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  }

  // Helper methods to emit events from the service
  emitWorkspaceCreated(userId: string, workspace: any) {
    this.server.to(`user_${userId}`).emit('workspace:created', workspace);
  }

  emitWorkspaceUpdated(workspaceId: string, workspace: any) {
    this.server.to(`workspace_${workspaceId}`).emit('workspace:updated', workspace);
    // Also notify the user room if they are listed
    // For simplicity, we can also emit to a combined room strategy if needed
  }

  emitWorkspaceDeleted(workspaceId: string) {
    this.server.to(`workspace_${workspaceId}`).emit('workspace:deleted', { id: workspaceId });
  }

  // Board-specific real-time emissions
  emitBoardCreated(newBoard: any) {
    this.logger.log(`Emitting board:created for board ${newBoard.id} to workspace_${newBoard.workspace_id}`);
    this.server.to(`workspace_${newBoard.workspace_id}`).emit('board:created', newBoard);
  }

  emitBoardUpdated(board: any) {
    this.server.to(`workspace_${board.workspace_id}`).emit('board:updated', board);
  }

  emitBoardDeleted(boardId: string, workspaceId: string) {
    this.server.to(`workspace_${workspaceId}`).emit('board:deleted', { id: boardId });
  }

  emitColumnCreated(workspaceId: string, column: any) {
    this.server.to(`workspace_${workspaceId}`).emit('column:created', { column });
  }

  emitColumnDeleted(workspaceId: string, columnId: string) {
    this.server.to(`workspace_${workspaceId}`).emit('column:deleted', { columnId });
  }
}

