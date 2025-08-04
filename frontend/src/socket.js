import { io } from "socket.io-client";

// ✅ Use Render backend URL in production
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  secure: true,
});
