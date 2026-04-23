import { Router } from "express";
import { createPost, getAll, getById } from "../controllers/posts";

const router = Router();

// Create Post
router.post("/", createPost);

// Get All Posts
router.get('/', getAll)

// Get Post By Id
router.get('/:id', getById)

export default router;
