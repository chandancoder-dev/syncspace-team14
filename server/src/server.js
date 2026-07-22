import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
import roomHandler from "./socket/roomHandler.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  roomHandler(io, socket);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
}
);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});