import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/room.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import codeRoutes from "./routes/code.routes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { protect } from "./middleware/auth.middleware.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", protect, roomRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/code", codeRoutes);
app.use("/api",chatRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("SyncSpace Backend is Running 🚀");
});

export default app;
