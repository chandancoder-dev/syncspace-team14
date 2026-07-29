import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

// Get Dashboard Statistics
router.get("/stats", getDashboardStats);

export default router;