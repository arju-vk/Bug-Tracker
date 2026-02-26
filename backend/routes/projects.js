const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, createProject).get(protect, getProjects);

router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route("/:id/members").post(protect, addMember);

router.route("/:id/members/:userId").delete(protect, removeMember);

module.exports = router;
