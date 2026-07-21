import express from "express";
import {
  createRoom,
  getRoom,
  joinRoom,
} from "../controllers/room.controller.js";

const router = express.Router();

// Create Room
router.post("/", createRoom);

// Get Room
router.get("/:roomId", getRoom);

// Join Room
router.post("/:roomId/join", joinRoom);

export default router;
