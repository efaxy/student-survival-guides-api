import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'

/**
 * Create a new post
 * Links the post to the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPost = async (req, res) => {
	try {
		const { title, text, category } = req.body
		const user = await User.findById(req.headers.userid)

		// Initialize new post with author information
		const newPost = new Post({
			username: user.username,
			title,
			text,
			category: category || 'General',
			author: req.headers.userid,
		})

		// Save post and update user's posts array
		await newPost.save()
		await User.findByIdAndUpdate(req.headers.userid, {
			$push: {
				posts: newPost._id,
			},
		})
		res.status(201).json(newPost)
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}

/**
 * Get all posts and popular posts
 * Popular posts are sorted by views (limit 5)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAll = async (req, res) => {
	try {
		// Fetch all posts sorted by creation date (newest first)
		const posts = await Post.find().sort('-createdAt')

		// Fetch top 5 popular posts based on views
		const popularPosts = await Post.find().limit(5).sort('-views')

		if (!posts) {
			return res.status(404).json({ message: 'No posts here' })
		}
		res.json({ posts, popularPosts })
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}

/**
 * Get a single post by ID
 * Increments the view count for each request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getById = async (req, res) => {
	try {
		// Find post and increment its views
		const post = await Post.findByIdAndUpdate(req.params.id, {
			$inc: { views: 1 },
		})

		if (!post) {
			return res.status(404).json({ message: 'Post not found' })
		}
		res.json(post)
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}

/**
 * Get all posts created by the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMyPosts = async (req, res) => {
	try {
		const user = await User.findById(req.headers.userid)
		if (!user) return res.status(404).json({ message: 'User not found' })

		// Fetch each post in the user's posts array
		const list = await Promise.all(
			user.posts.map((post) => {
				return Post.findById(post)
			}),
		)

		res.json(list)
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}

/**
 * Remove a post by ID
 * Also removes the post reference from the user's collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const removePost = async (req, res) => {
	try {
		const post = await Post.findByIdAndDelete(req.params.id)
		if (!post)
			return res.status(404).json({ message: 'This post does not exist' })

		// Remove post ID from user's posts array
		await User.findByIdAndUpdate(req.headers.userid, {
			$pull: { posts: req.params.id },
		})

		res.json({ message: 'Post was deleted' })
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}

/**
 * Update an existing post's content
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePost = async (req, res) => {
	try {
		const { title, text, category } = req.body
		const post = await Post.findById(req.params.id)

		if (!post) return res.status(404).json({ message: 'Post not found' })

		// Update fields if provided
		post.title = title
		post.text = text
		post.category = category || post.category

		await post.save()

		res.json(post)
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}

/**
 * Get all comments associated with a specific post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPostComments = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) return res.status(404).json({ message: 'Post not found' })

		// Fetch each comment object by its ID
		const list = await Promise.all(
			post.comments.map((comment) => {
				return Comment.findById(comment)
			}),
		)
		res.json(list)
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}

/**
 * Toggle like/unlike for a post
 * Uses user ID from headers to track likes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const likePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) return res.status(404).json({ message: 'Post not found' })

		const userId = req.headers.userid
		if (!userId) return res.status(401).json({ message: 'Unauthorized' })

		// Check if user already liked the post
		const index = post.likes.findIndex((id) => id.toString() === userId)

		if (index === -1) {
			// Add like
			post.likes.push(userId)
		} else {
			// Remove like (unlike)
			post.likes = post.likes.filter((id) => id.toString() !== userId)
		}

		await post.save()
		res.json(post)
	} catch (error) {
		res.status(500).json({ message: 'Something is wrong' })
	}
}
