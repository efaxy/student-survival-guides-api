import Post from "../models/Post";
import User from "../models/User";

// Create Post
export const createPost = async (req, res) => {
    try {
        const {title, text} = req.body
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
        res.json({message: "Something is wrong"})
    }
}

// Get All Posts
export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')
        if(!posts) {
            return res.json({message: 'No posts here'})
        }
        res.json({posts, popularPosts})
    } catch (error) {
        res.json({message: 'Something is wrong'})
    }
}

// Get Post By Id
export const getById = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(req.params.id, {
            $inc: {views: 1}
        })
        res.json(post)
    } catch (error) {
        res.json({message: 'Something is wrong'})
    }
}