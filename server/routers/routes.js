import express from "express";
const router = express.Router();

import login from "../controllers/user_controller.js";

router.post("/auth/login", login);


export default router