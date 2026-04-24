import { Router } from 'express'
import { createComment } from '../controllers/comments.js'

const router = new Router()

// Create Comment Route
router.post('/:id', createComment)

export default router