import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.js'

const router = Router()

// Registration Route
router.post('/register', register)

// Login Route
router.post('/login', login)

// Get Current User Profile Route
router.get('/me', getMe)

export default router
