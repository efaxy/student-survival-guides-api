import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

// Create Post
export const createPost = async (req, res) => {
    try {
        const { title, text, category } = req.body
        const user = await User.findById(req.headers.userid)

        const newPost = new Post({
            username: user.username,
            title,
            text,
            category: category || 'General',
            author: req.headers.userid
        })


        await newPost.save()
        await User.findByIdAndUpdate(req.headers.userid, {
            $push: {
                posts: newPost._id
            }
        })
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ message: "Something is wrong" })
    }
}

// Get All Posts
export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')
        if (!posts) {
            return res.status(404).json({ message: 'No posts here' })
        }
        res.json({ posts, popularPosts })
    } catch (error) {
        res.status(500).json({ message: 'Something is wrong' })
    }
}

// Get Post By Id
export const getById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        })
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
        res.json(post)
    } catch (error) {
        res.status(500).json({ message: 'Something is wrong' })
    }
}

// Get All Posts
export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.headers.userid)
        if (!user) return res.status(404).json({ message: 'User not found' })

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

// Remove post
export const removePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        if (!post) return res.status(404).json({ message: 'This post does not exist' })

        await User.findByIdAndUpdate(req.headers.userid, {
            $pull: { posts: req.params.id },
        })

        res.json({ message: 'Post was deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Something is wrong' })
    }
}

// Update post
export const updatePost = async (req, res) => {
    try {
        const { title, text, category } = req.body
        const post = await Post.findById(req.params.id)

        if (!post) return res.status(404).json({ message: 'Post not found' })

        post.title = title
        post.text = text
        post.category = category || post.category


        await post.save()

        res.json(post)
    } catch (error) {
        res.status(500).json({ message: 'Something is wrong' })
    }
}

// Get Post Comments
export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })

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

// Like post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })

        const userId = req.headers.userid
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })

        const index = post.likes.findIndex((id) => id.toString() === userId)

        if (index === -1) {
            post.likes.push(userId)
        } else {
            post.likes = post.likes.filter((id) => id.toString() !== userId)
        }

        await post.save()
        res.json(post)
    } catch (error) {
        res.status(500).json({ message: 'Something is wrong' })
    }
}