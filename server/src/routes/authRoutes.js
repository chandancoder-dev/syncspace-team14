import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
// Protected route
router.get("/me", protect, getCurrentUser);

export default router;