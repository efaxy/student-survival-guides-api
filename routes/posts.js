import { Router } from "express";
import { createPost } from "../controllers/posts";

const router = Router();

// Create Post
router.post("/", createPost);



export default router;
