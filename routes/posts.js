import { Router } from "express";
import { createPost, getAll, getById } from "../controllers/posts";

const router = Router();

// Create Post
router.post("/", createPost);

// Get All Posts
router.get('/', getAll)

// Get Post By Id
router.get('/:id', getById)

// Update Post
router.put('/:id', updatePost)

// Get My Posts
router.get('/user/me', getMyPosts)

// Remove Post
router.delete('/:id', removePost)

// Get Post Comments
router.get('/comments/:id', getPostComments)

export default router;
