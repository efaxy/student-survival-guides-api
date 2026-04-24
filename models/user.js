import mongoose from "mongoose";

/**
 * User Schema
 * Represents a user account in the system
 */
const userSchema = new mongoose.Schema({
    // Unique username (letters only)
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z]+$/, 'Username must contain only English letters']
    },
    // User password (plain text for this version)
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    // List of post IDs created by the user
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ]
},
    // Automatically add createdAt and updatedAt fieldss
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
