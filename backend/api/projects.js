const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Ticket = require("../models/Ticket");
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

// Get all projects
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.userId }, { members: req.userId }],
    })
      .populate("owner", "name email")
      .populate("members", "name email");
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create project
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, key } = req.body;

    const project = new Project({
      name,
      description,
      key,
      owner: req.userId,
      members: [],
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single project
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description, key } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, key },
      { new: true },
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all tickets associated with the project
    await Ticket.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
