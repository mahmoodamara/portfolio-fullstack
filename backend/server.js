// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

/* ─────────────── Static uploads ─────────────── */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ─────────────── Global middleware ───────────── */
app.use(cors());
app.use(express.json());

/* ─────────────── Core routes ─────────────── */
app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/projects",      require("./routes/projectRoutes"));
app.use("/api/messages",      require("./routes/messageRoutes"));
app.use("/api/about",         require("./routes/aboutRoutes"));
app.use("/api/gallery",       require("./routes/galleryRoutes"));
app.use("/api/testimonials",  require("./routes/testimonialRoutes"));
app.use("/api/blog",          require("./routes/blogRoutes"));
app.use("/api/stats",         require("./routes/stats.routes"));
app.use("/api/calendar",      require("./routes/calendar.routes"));
app.use("/api/settings",      require("./routes/settings.routes"));
app.use("/api/notifications", require("./routes/notifications.routes"));
app.use("/api/activity",      require("./routes/activity.routes"));
app.use("/api/upload",        require("./routes/upload.routes"));
app.use("/api/pdfUpload",     require("./routes/pdfUpload.routes"));
app.use("/api/ai",            require("./routes/ai.routes"));

/* ─────────────── NEW personal-data routes ─────────────── */
app.use("/api/skills",         require("./routes/skills.routes"));
app.use("/api/experience",     require("./routes/experience.routes"));
app.use("/api/education",      require("./routes/education.routes"));
app.use("/api/certifications", require("./routes/certifications.routes"));
app.use("/api/links",          require("./routes/links.routes"));
app.use("/api/analytics",      require("./routes/analytics.routes"));

/* ─────────────── Health check ─────────────── */
app.get("/api", (req, res) => res.send("✅ API up"));

/* ─────────────── Serve React build ─────────────── */
const frontendPath = path.join(__dirname, "../portfolio-frontend/build");
app.use(express.static(frontendPath));

/* ─────────────── SPA fallback ─────────────── */
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

const pool = require('./db');

/* ─────────────── Start server ─────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
