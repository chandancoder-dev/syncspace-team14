import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/room.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import dbConnect from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
dbConnect();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SyncSpace Backend is Running 🚀");
});

export default app;
