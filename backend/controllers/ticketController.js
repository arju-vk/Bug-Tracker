const Ticket = require("../models/Ticket");
const Project = require("../models/Project");

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { title, description, project, priority, type, assignee, dueDate } =
      req.body;

    // Check if project exists and user has access
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const hasAccess =
      projectDoc.owner.toString() === req.user._id.toString() ||
      projectDoc.members.some(
        (m) => m.user.toString() === req.user._id.toString(),
      );

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Not authorized to create tickets in this project" });
    }

    // Generate ticket key
    const ticketCount = await Ticket.countDocuments({ project });
    const ticketKey = `${projectDoc.key}-${ticketCount + 1}`;

    const ticket = await Ticket.create({
      title,
      description,
      project,
      ticketKey,
      priority: priority || "Medium",
      type: type || "Bug",
      reporter: req.user._id,
      assignee: assignee || null,
      dueDate: dueDate || null,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar")
      .populate("project", "name key");

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets for a project
// @route   GET /api/tickets/project/:projectId
// @access  Private
const getTicketsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignee, search } = req.query;

    let query = { project: projectId };

    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (assignee) {
      query.assignee = assignee === "null" ? null : assignee;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ticketKey: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(query)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar")
      .populate("project", "name key")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar")
      .populate("project", "name key owner members");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user has access to the project
    const hasAccess =
      ticket.project.owner.toString() === req.user._id.toString() ||
      ticket.project.members.some(
        (m) => m.user.toString() === req.user._id.toString(),
      );

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this ticket" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      type,
      assignee,
      dueDate,
      labels,
    } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user has access to the project
    const project = await Project.findById(ticket.project);
    const hasAccess =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (m) => m.user.toString() === req.user._id.toString(),
      );

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ticket" });
    }

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.status = status || ticket.status;
    ticket.priority = priority || ticket.priority;
    ticket.type = type || ticket.type;
    ticket.assignee = assignee !== undefined ? assignee : ticket.assignee;
    ticket.dueDate = dueDate !== undefined ? dueDate : ticket.dueDate;
    ticket.labels = labels || ticket.labels;

    const updatedTicket = await ticket.save();

    const populatedTicket = await Ticket.findById(updatedTicket._id)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar")
      .populate("project", "name key");

    res.json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user has access to the project
    const project = await Project.findById(ticket.project);
    const hasAccess =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (m) => m.user.toString() === req.user._id.toString(),
      );

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this ticket" });
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status (for Kanban)
// @route   PATCH /api/tickets/:id/status
// @access  Private
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user has access to the project
    const project = await Project.findById(ticket.project);
    const hasAccess =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (m) => m.user.toString() === req.user._id.toString(),
      );

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ticket" });
    }

    ticket.status = status;
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar")
      .populate("project", "name key");

    res.json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTicketsByProject,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
};
