import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

/**
 * Create a new comment for a post
 * Adds the comment to the database and pushes its ID to the post's comments array
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createComment = async (req, res) => {
    try {
        const { postId, comment } = req.body

        // Validation: Comment cannot be empty
        if (!comment)
            return res.json({ message: 'Comment cannot be empty' })

        // Create and save new comment
        const newComment = new Comment({ comment })
        await newComment.save()

        try {
            // Push comment ID to post's comments array
            await Post.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            })
        } catch (error) {
            console.log(error)
        }

        res.json(newComment)
    } catch (error) {
        res.json({ message: 'Something is wrong' })
    }
}