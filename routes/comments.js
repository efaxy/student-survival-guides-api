import { Router } from 'express'
const router = new Router()
import { createComment } from '../controllers/comments.js'

// Create Comment
router.post('/:id', createComment)

export default router