import mongoose from 'mongoose'

/**
 * Comment Schema
 * Represents a user comment on a post
 */
const CommentSchema = new mongoose.Schema(
    {
        // The text content of the comment
        comment: { type: String, required: true },
        // Reference to the User who wrote the comment
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    // Automatically add createdAt and updatedAt fields
    { timestamps: true },
)
export default mongoose.model('Comment', CommentSchema)