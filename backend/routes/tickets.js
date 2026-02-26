const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTicketsByProject,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, createTicket);

router.route("/project/:projectId").get(protect, getTicketsByProject);

router
  .route("/:id")
  .get(protect, getTicketById)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

router.route("/:id/status").patch(protect, updateTicketStatus);

module.exports = router;
