import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import roomRoutes from "./routes/room.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js"
import dbConnect from "./config/db.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const corsOptions = {
    origin: "http://localhost:5173", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
};
app.use(cors(corsOptions));
//Database connecttion.
dbConnect();
// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api",userRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("SyncSpace Backend is Running 🚀");
});

export default app;
