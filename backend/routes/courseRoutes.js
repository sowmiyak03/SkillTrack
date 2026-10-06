const express = require("express");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all courses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(courses);

  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      message: "Server error while fetching courses",
    });
  }
});


// Add a new course
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      platform,
      progress,
      status,
    } = req.body;

    if (!title || !platform) {
      return res.status(400).json({
        message: "Please provide course title and platform",
      });
    }

    const course = new Course({
      userId: req.user.id,
      title,
      platform,
      progress: progress ?? 0,
      status: status || "Not Started",
    });

    await course.save();

    res.status(201).json({
      message: "Course added successfully",
      course,
    });

  } catch (error) {
    console.error("Add course error:", error);

    res.status(500).json({
      message: "Server error while adding course",
    });
  }
});


// Update a course
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      platform,
      progress,
      status,
    } = req.body;

    const course = await Course.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        title,
        platform,
        progress,
        status,
      },
      {
        new: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });

  } catch (error) {
    console.error("Update course error:", error);

    res.status(500).json({
      message: "Server error while updating course",
    });
  }
});


// Delete a course
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.error("Delete course error:", error);

    res.status(500).json({
      message: "Server error while deleting course",
    });
  }
});

module.exports = router;