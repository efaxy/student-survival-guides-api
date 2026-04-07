import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// Constants
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

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