const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get comments by ticket
router.get("/ticket/:ticketId", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create comment
router.post("/", auth, async (req, res) => {
  try {
    const { text, ticket } = req.body;

    const comment = new Comment({
      text,
      ticket,
      user: req.userId,
    });

    await comment.save();

    // Populate user info before sending response
    await comment.populate("user", "name email");

    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update comment
router.put("/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true },
    ).populate("user", "name email");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete comment
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
