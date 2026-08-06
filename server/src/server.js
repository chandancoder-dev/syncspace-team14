import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dbConnect from "./config/db.js";
import roomHandler from "./socket/roomHandler.js";
import videoHandler from "./socket/videoHandler.js"; 

// Connect to database
dbConnect();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Initialize video socket handlers
videoHandler(io);

io.on("connection", (socket) => {
  roomHandler(io, socket);

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});