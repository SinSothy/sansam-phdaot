import { useEffect } from "react";
import { socketClient } from "../socket.client";

export const useSocket = (userId?: string) => {
  useEffect(() => {
    if (userId) {
      socketClient.setUserId(userId);
    }
    
    const socket = socketClient.connect();

    return () => {
      // For now, we connect globally. In a real app, we might disconnect on logout.
      // socketClient.disconnect();
    };
  }, [userId]);

  return socketClient.socket;
};
