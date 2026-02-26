const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Project = require("../models/Project");
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

// Get tickets by project
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;

    const query = { project: req.params.projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;

    const tickets = await Ticket.find(query)
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create ticket
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, type, project, assignee } = req.body;

    // Get project to generate ticket key
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Count tickets to generate ticket key
    const ticketCount = await Ticket.countDocuments({ project });
    const ticketKey = `${projectDoc.key}-${ticketCount + 1}`;

    const ticket = new Ticket({
      title,
      description,
      priority: priority || "Medium",
      type: type || "Task",
      status: "To Do",
      project,
      assignee,
      reporter: req.userId,
      ticketKey,
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single ticket
router.get("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("project", "name key");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update ticket
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, priority, type, status, assignee } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, type, status, assignee },
      { new: true },
    ).populate("assignee", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update ticket status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("assignee", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete ticket
router.delete("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
