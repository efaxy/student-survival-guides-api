import mongoose from 'mongoose'

/**
 * Post Schema
 * Represents a blog post or guide in the system
 */
const PostSchema = new mongoose.Schema(
	{
		// Display name of the author
		username: { type: String },
		// Title of the post
		title: { type: String, required: true },
		// Content body of the post
		text: { type: String, required: true },
		// Category (e.g., Exam Prep, Housing, Social)
		category: { type: String, default: 'General' },
		// Number of views
		views: { type: Number, default: 0 },
		// Array of User IDs who liked the post
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		// Reference to the User who created the post
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		// Array of Comment references
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	},
	// Automatically add createdAt and updatedAt fields
	{ timestamps: true },
)

export default mongoose.model('Post', PostSchema)
