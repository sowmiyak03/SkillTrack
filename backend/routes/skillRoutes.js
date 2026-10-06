const express = require("express");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// GET ALL SKILLS
// ==============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(skills);

  } catch (error) {
    console.error("Get skills error:", error);

    res.status(500).json({
      message: "Server error while fetching skills",
    });
  }
});


// ==============================
// ADD SKILL
// ==============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || level === undefined) {
      return res.status(400).json({
        message: "Please provide skill name and level",
      });
    }

    const skill = new Skill({
      userId: req.user.id,
      name,
      level,
    });

    await skill.save();

    res.status(201).json({
      message: "Skill added successfully",
      skill,
    });

  } catch (error) {
    console.error("Add skill error:", error);

    res.status(500).json({
      message: "Server error while adding skill",
    });
  }
});


// ==============================
// UPDATE SKILL
// ==============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, level } = req.body;

    const skill = await Skill.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        name,
        level,
      },
      {
        new: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill updated successfully",
      skill,
    });

  } catch (error) {
    console.error("Update skill error:", error);

    res.status(500).json({
      message: "Server error while updating skill",
    });
  }
});


// ==============================
// DELETE SKILL
// ==============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully",
    });

  } catch (error) {
    console.error("Delete skill error:", error);

    res.status(500).json({
      message: "Server error while deleting skill",
    });
  }
});


module.exports = router;