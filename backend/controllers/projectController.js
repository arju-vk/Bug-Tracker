const Project = require("../models/Project");
const Ticket = require("../models/Ticket");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, key } = req.body;

    const project = await Project.create({
      name,
      description,
      key,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    }).populate("owner", "name email avatar");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this project" });
    }

    project.name = name || project.name;
    project.description = description || project.description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    // Delete all tickets associated with the project
    await Ticket.deleteMany({ project: project._id });

    await project.deleteOne();
    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add members" });
    }

    // Check if member already exists
    const memberExists = project.members.find(
      (m) => m.user.toString() === userId,
    );

    if (memberExists) {
      return res.status(400).json({ message: "Member already in project" });
    }

    project.members.push({ user: userId, role: role || "member" });
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove members" });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.userId,
    );

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
