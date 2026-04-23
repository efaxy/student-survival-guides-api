import Post from "../models/Post";
import User from "../models/User";

// Create Post
export const createPost = async (req, res) => {
    try {
        const { title, text } = req.body
        const user = await User.findById(req.UserId)

        const newPost = new Post({
            username: user.username,
            title,
            text,
            author: req.UserId
        })

        await newPost.save()
        await User.findByIdAndUpdate(req.UserId, {
            $push: {
                posts: newPost
            }
        })
        res.json(newPost)
    } catch (error) {
        res.json({ message: "Something is wrong" })
    }
}

// Get All Posts
export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')
        if (!posts) {
            return res.json({ message: 'No posts here' })
        }
        res.json({ posts, popularPosts })
    } catch (error) {
        res.json({ message: 'Something is wrong' })
    }
}

// Get Post By Id
export const getById = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(req.params.id, {
            $inc: { views: 1 }
        })
        res.json(post)
    } catch (error) {
        res.json({ message: 'Something is wrong' })
    }
}

// Get All Posts
export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const list = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id)
            }),
        )

        res.json(list)
    } catch (error) {
        res.json({ message: 'Something is wrong' })
    }
}

// Remove post
export const removePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        if (!post) return res.json({ message: 'This post does not exist' })

        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id },
        })

        res.json({ message: 'Post was deleted' })
    } catch (error) {
        res.json({ message: 'Something is wrong' })
    }
}

// Update post
export const updatePost = async (req, res) => {
    try {
        const { title, text, id } = req.body
        const post = await Post.findById(id)

        post.title = title
        post.text = text

        await post.save()

        res.json(post)
    } catch (error) {
        res.json({ message: 'Something is wrong' })
    }
}

// Get Post Comments
export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        res.json(list)
    } catch (error) {
        res.json({ message: 'Something is wrong' })
    }
}