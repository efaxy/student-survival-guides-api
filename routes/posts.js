import { Router } from "express";
import { createPost, getAll } from "../controllers/posts";

const router = Router();

// Create Post
router.post("/", createPost);

// Get All Posts
router.get('/', getAll)

export default router;
