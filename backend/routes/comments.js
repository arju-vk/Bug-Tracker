const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByTicket,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, createComment);

router.route("/ticket/:ticketId").get(protect, getCommentsByTicket);

router.route("/:id").put(protect, updateComment).delete(protect, deleteComment);

module.exports = router;
