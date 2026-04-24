import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'
import commentRoute from './routes/comments.js'

const app = express()
dotenv.config()

// Configuration Constants
const PORT = process.env.PORT || 3001
const DB_URL = process.env.MONGODB_URL

// Middleware Setup
app.use(
	cors({
		origin: [
			'https://efaxy.github.io',
			'http://localhost:3000',
			'http://localhost:3001',
		],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization', 'userid'],
	}),
) // Enable Cross-Origin Resource Sharing
app.use(express.json()) // Enable JSON parsing for request bodies

// Route Definitions
app.use('/api/auth', authRoute) // Authentication routes
app.use('/api/posts', postRoute) // Post management routes
app.use('/api/comments', commentRoute) // Comment management routes

/**
 * Connect to MongoDB and start the Express server
 */
async function startServer() {
	try {
		// Attempt to connect to the database
		await mongoose.connect(DB_URL)
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error('Error connecting to MongoDB:', error)
	}

	// Start listening for requests
	app.listen(PORT, () => {
		console.log('Server is running on port: ' + PORT)
	})
}

// Initialize the server
startServer()
