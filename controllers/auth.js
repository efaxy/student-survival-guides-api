import User from "../models/User";

// Register User
export const register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        const isUsed = await User.findOne({ username });

        if (isUsed) {
            return res.json({ message: "User already exists" });
        }

        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save();
        res.json({ message: "User created successfully" });

    } catch (error) {

        console.log(error);
        res.json({ message: "Something went wrong" });

    }
};

// Login User
export const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.json({ message: "Invalid password" });
        }

        res.json({ message: "Login successful" });

    } catch (error) {

        res.json({ message: "Login failed" });

    }
};

// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'User not found',
            })
        }

        res.json(user)
    } catch (error) {
        res.json({ message: 'No access' })
    }
}
