const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const courseRoutes = require("./routes/courseRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("SkillTrack Backend is Running!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `SkillTrack server running on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed");
    console.log(error.message);
  });