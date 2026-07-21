import express from "express";
import cors from "cors";
import roomRoutes from "./routes/room.routes.js";
import userRoutes from "./routes/user.routes.js"
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api",userRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("SyncSpace Backend is Running 🚀");
});

export default app;
