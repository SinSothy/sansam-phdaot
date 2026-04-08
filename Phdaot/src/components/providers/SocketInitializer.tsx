"use client";

import { useEffect } from "react";
import { useSocket } from "@/api/hooks/useSocket";
import { workspaceManager } from "@/api/managers/workspace.manager";

export function SocketInitializer() {
  // Initialize socket connection
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      // Setup workspace listeners
      workspaceManager.setupSocketListeners();
    }
  }, [socket]);

  return null; // This component doesn't render anything
}
