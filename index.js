import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/auth.js";

const app = express();
dotenv.config();

// Constants
const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);

async function startServer() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }

    app.listen(PORT, () => {
        console.log("Server is running on port: " + PORT);
    });
}

startServer();