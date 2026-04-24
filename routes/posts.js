import { Router } from "express";
import { createPost, getAll, getById, updatePost, getMyPosts, removePost, getPostComments, likePost } from "../controllers/posts.js";

const router = Router();

// Create Post Route
router.post("/", createPost);

// Get All Posts Route (includes popular posts)
router.get('/', getAll)

// Get Single Post By ID Route
router.get('/:id', getById)

// Update Post Route
router.put('/:id', updatePost)

// Get Posts by Authenticated User Route
router.get('/user/me', getMyPosts)

// Delete Post Route
router.delete('/:id', removePost)

// Get All Comments for a Post Route
router.get('/comments/:id', getPostComments)

// Toggle Like on a Post Route
router.put('/like/:id', likePost)

export default router;

