import { Router } from "express";
import { register, login, getUser } from "../controllers/auth.js";

const router = Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get User
router.get("/user", getUser);

export default router;
