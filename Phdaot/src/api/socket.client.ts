import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://127.0.0.1:3001/workspaces";

/**
 * Socket Client Configuration
 */
class SocketClient {
  private static instance: SocketClient;
  public socket: Socket | null = null;
  private userId: string = "d933b066-f00a-4402-a782-c731a481c823"; // Use test ID for now

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      query: {
        userId: this.userId,
      },
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket namespace: workspaces");
      // Join general updates room
      this.socket?.emit("subscribe_workspaces");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });

    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public setUserId(userId: string) {
    this.userId = userId;
    if (this.socket?.connected) {
      this.disconnect();
      this.connect();
    }
  }

  /**
   * Helper to wait for the socket to connect.
   */
  public async waitForConnection(timeout: number = 5000): Promise<void> {
    if (this.socket?.connected) return;

    if (!this.socket) {
      this.connect();
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Socket connection timeout"));
      }, timeout);

      const onConnect = () => {
        clearTimeout(timer);
        resolve();
      };

      this.socket?.once("connect", onConnect);
    });
  }

  /**
   * Helper to emit an event and wait for an acknowledgment (request-response).
   */
  public async emitAsync<T>(event: string, data: any = {}, timeout: number = 15000): Promise<T> {
    try {
      // Ensure we are connected first
      await this.waitForConnection();
    } catch (error) {
      console.error("Failed to establish socket connection for emitAsync", error);
      throw error;
    }

    return new Promise((resolve, reject) => {
      const socket = this.socket;
      if (!socket) return reject(new Error("Socket not initialized"));

      const timer = setTimeout(() => {
        reject(new Error(`Socket timeout for event: ${event}`));
      }, timeout);

      socket.emit(event, data, (response: any) => {
        clearTimeout(timer);
        if (!response) {
          reject(new Error(`No response received for event: ${event}`));
        } else if (response.status === "error" || response.success === false) {
          reject(new Error(response.message || response.error || "Socket request failed"));
        } else {
          // Standardized API usually wraps data in .data, but handle raw response too
          resolve(response.data !== undefined ? response.data : response);
        }
      });
    });
  }
}

export const socketClient = SocketClient.getInstance();
