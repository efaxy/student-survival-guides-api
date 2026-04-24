import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z]+$/, 'Username должен содержать только английские буквы']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Пароль должен быть не менее 6 символов']
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ]
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
