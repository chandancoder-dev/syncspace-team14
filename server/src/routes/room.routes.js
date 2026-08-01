import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoom,
  joinRoom,
  endRoom,
  inviteToRoom,
} from "../controllers/room.controller.js";

const router = express.Router();

// Create Room
router.post("/", createRoom);

// Get All Rooms (user's rooms)
router.get("/", getAllRooms);

// Get Single Room
router.get("/:roomId", getRoom);

// Join Room
router.post("/:roomId/join", joinRoom);

// End Room (host leaves)
router.post("/:roomId/end", endRoom);

// Invite user to room (host only)
router.post("/:roomId/invite", inviteToRoom);

export default router;
