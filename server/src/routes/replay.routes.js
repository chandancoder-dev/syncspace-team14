import { Router } from "express";
import { getReplayData } from "../controllers/replay.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/replay/:roomId — get all Yjs updates for replay
router.get("/:roomId", protect, getReplayData);

export default router;
