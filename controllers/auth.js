import User from "../models/User.js";

// Register User
export const register = async (req, res) => {
    try {

        const { username, password } = req.body;

        // Validation: Username must be only English letters
        const usernameRegex = /^[a-zA-Z]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: "Username must contain only English letters" });
        }

        // Validation: Password length >= 6
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Validation: Password must contain at least one symbol (special character)
        const symbolRegex = /[^a-zA-Z0-9\s]/;
        if (!symbolRegex.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one special character" });
        }

        const isUsed = await User.findOne({ username });

        if (isUsed) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            username,
            password,
        });

        await newUser.save();
        res.status(201).json({
            user: newUser,
            message: "User created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка базы данных (SSG): " + error.message });
    }
};

// Login User
export const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({
            user,
            message: "Login successful"
        });

    } catch (error) {

        res.status(500).json({ message: "Login failed" });

    }
};

// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.headers.userid)

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'No access' })
    }
}
