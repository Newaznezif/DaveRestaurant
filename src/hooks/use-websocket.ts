import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "@/constants";
import { useAuthStore } from "@/stores/auth.store";

export function useWebSocket() {
  const { tokens } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!tokens?.accessToken) return;

    const socket = io(API_CONFIG.WS_URL, {
      auth: {
        token: tokens.accessToken,
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [tokens?.accessToken]);

  return socketRef.current;
}

export function useOrderUpdates(onOrderUpdate: (order: any) => void) {
  const socket = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("order:created", onOrderUpdate);
    socket.on("order:updated", onOrderUpdate);

    return () => {
      socket.off("order:created", onOrderUpdate);
      socket.off("order:updated", onOrderUpdate);
    };
  }, [socket, onOrderUpdate]);
}