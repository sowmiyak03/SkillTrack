const express = require("express");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all projects
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(projects);

  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error while fetching projects",
    });
  }
});


// Add a new project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      status,
      githubLink,
    } = req.body;

    if (!title || !description || !technologies) {
      return res.status(400).json({
        message:
          "Please provide title, description and technologies",
      });
    }

    const project = new Project({
      userId: req.user.id,
      title,
      description,
      technologies,
      status: status || "Not Started",
      githubLink: githubLink || "",
    });

    await project.save();

    res.status(201).json({
      message: "Project added successfully",
      project,
    });

  } catch (error) {
    console.error("Add project error:", error);

    res.status(500).json({
      message: "Server error while adding project",
    });
  }
});


// Update a project
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      status,
      githubLink,
    } = req.body;

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        title,
        description,
        technologies,
        status,
        githubLink,
      },
      {
        new: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });

  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Server error while updating project",
    });
  }
});


// Delete a project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });

  } catch (error) {
    console.error("Delete project error:", error);

  res.status(500).json({
      message: "Server error while deleting project",
    });
  }
});


module.exports = router;