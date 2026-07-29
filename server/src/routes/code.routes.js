import { Router } from "express";
import { executeCode } from "../controllers/code.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/code/execute — run code (requires auth)
router.post("/execute", protect, executeCode);

export default router;
