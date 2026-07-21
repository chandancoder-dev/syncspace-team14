import express from "express";
import cors from "cors";
import roomRoutes from "./routes/room.routes.js";
import userRoutes from "./routes/user.routes.js"
import mongoose from "mongoose";
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
mongoose.connect("mongodb://127.0.0.1:27017/syncspaceDB")
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e));
// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api",userRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("SyncSpace Backend is Running 🚀");
});

export default app;
