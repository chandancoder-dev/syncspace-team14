import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// Register
router.post("/auth/register", register);

// Login
router.post("/auth/login", login);

export default router;
