const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const Project = require("../models/Project");

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { ticketId, text, mentions } = req.body;

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
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
        .json({ message: "Not authorized to comment on this ticket" });
    }

    const comment = await Comment.create({
      ticket: ticketId,
      user: req.user._id,
      text,
      mentions: mentions || [],
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email avatar")
      .populate("mentions", "name email avatar");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for a ticket
// @route   GET /api/comments/ticket/:ticketId
// @access  Private
const getCommentsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comments = await Comment.find({ ticket: ticketId })
      .populate("user", "name email avatar")
      .populate("mentions", "name email avatar")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const { text, mentions } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.text = text || comment.text;
    comment.mentions = mentions || comment.mentions;

    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id)
      .populate("user", "name email avatar")
      .populate("mentions", "name email avatar");

    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByTicket,
  updateComment,
  deleteComment,
};
