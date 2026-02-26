const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (only when not in Vercel serverless environment)
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!MONGODB_URI) {
    console.log("MONGODB_URI not set - API will return error");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

// Import routes
const authRoutes = require("./auth");
const projectsRoutes = require("./projects");
const ticketsRoutes = require("./tickets");
const commentsRoutes = require("./comments");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/comments", commentsRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Bug Tracker API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Export for Vercel
module.exports = app;
