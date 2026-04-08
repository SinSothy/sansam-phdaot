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
  @SubscribeMessage('unsubscribe_workspace')
  handleUnsubscribeWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string },
  ) {
    client.leave(`workspace_${data.workspaceId}`);
    this.logger.log(`Client ${client.id} unsubscribed from workspace ${data.workspaceId}`);
    return { event: 'unsubscribed', data: { room: `workspace_${data.workspaceId}` } };
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
}

