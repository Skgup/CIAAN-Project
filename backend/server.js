import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import http from "http";
import { Server } from "socket.io";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";

dotenv.config();
connectDB();
const app = express();

// ✅ Allow CORS from frontend
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Configure Socket.IO with same CORS
const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log(`🔗 Socket connected: ${socket.id}`);
  socket.on("new_post", () => io.emit("refresh_feed"));
  socket.on("new_comment", () => io.emit("refresh_feed"));
  socket.on("reaction", () => io.emit("refresh_feed"));
  socket.on("disconnect", () => console.log(`❌ Socket disconnected: ${socket.id}`));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
