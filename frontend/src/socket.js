import { io } from "socket.io-client";

// ✅ Use environment variable for production
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  secure: true,
  reconnection: true,         // ✅ Auto reconnect
  reconnectionAttempts: 5,    // ✅ Retry a few times
  reconnectionDelay: 2000
});
