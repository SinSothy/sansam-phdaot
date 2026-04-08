import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      // In a real application, you would verify the JWT token here
      // const token = client.handshake.auth.token || client.handshake.headers.authorization;
      // const payload = await this.jwtService.verifyAsync(token);
      // client.data.user = payload;

      // For now, we'll mock the user from the handshake query or headers for testing
      // or just assume a test user if not provided.
      const userId = client.handshake.query.userId as string || client.handshake.headers['x-user-id'] as string;
      
      if (!userId) {
        // In production, throw UnauthorizedException
        // throw new UnauthorizedException('Missing user identity in WebSocket connection');
        
        // Mock user for testing if none provided
        client.data.user = { id: 'd933b066-f00a-4402-a782-c731a481c823' };
      } else {
        client.data.user = { id: userId };
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
