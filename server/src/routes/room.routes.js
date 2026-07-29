import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoom,
  joinRoom,
} from "../controllers/room.controller.js";

const router = express.Router();

// Create Room
router.post("/", createRoom);

// Get All Rooms
router.get("/", getAllRooms);

// Get Room
router.get("/:roomId", getRoom);

// Join Room
router.post("/:roomId/join", joinRoom);

export default router;
