const express = require("express");
const multer = require("multer");
const path = require("path");

const Certificate = require("../models/Certificate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

// Get all certificates
router.get("/", authMiddleware, async (req, res) => {
  try {
    const certificates = await Certificate.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(certificates);
  } catch (error) {
    console.error("Get certificates error:", error);

    res.status(500).json({
      message: "Server error while fetching certificates",
    });
  }
});

// Add a new certificate
router.post(
  "/",
  authMiddleware,
  upload.single("certificateFile"),
  async (req, res) => {
    try {
      const {
        title,
        organization,
        year,
        credentialId,
        certificateLink,
      } = req.body;

      const certificateFile = req.file
        ? `/uploads/${req.file.filename}`
        : "";

      if (!title || !organization || !year) {
        return res.status(400).json({
          message:
            "Please provide title, organization and year",
        });
      }

      const certificate = new Certificate({
        userId: req.user.id,
        title,
        organization,
        year,
        credentialId: credentialId || "",
        certificateLink: certificateLink || "",
        certificateFile: certificateFile,
      });

      await certificate.save();

      res.status(201).json({
        message: "Certificate added successfully",
        certificate,
      });
    } catch (error) {
      console.error("Add certificate error:", error);

      res.status(500).json({
        message: "Server error while adding certificate",
      });
    }
  }
);

// Update a certificate
router.put(
  "/:id",
  authMiddleware,
  upload.single("certificateFile"),
  async (req, res) => {
  try {
    const {
      title,
      organization,
      year,
      credentialId,
      certificateLink,
    } = req.body;
    const certificateFile = req.file
  ? `/uploads/${req.file.filename}`
  : null;

    const certificate =
      await Certificate.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user.id,
        },
        {
  title,
  organization,
  year,
  credentialId,
  certificateLink,
  ...(certificateFile && {
    certificateFile,
  }),
},
        {
          new: true,
        }
      );

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      message: "Certificate updated successfully",
      certificate,
    });
  } catch (error) {
    console.error(
      "Update certificate error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating certificate",
    });
  }
});

// Delete a certificate
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const certificate =
      await Certificate.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete certificate error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting certificate",
    });
  }
});

module.exports = router;