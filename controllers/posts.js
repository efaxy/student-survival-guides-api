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