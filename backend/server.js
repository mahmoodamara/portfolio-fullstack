// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/blog", require("./routes/blogRoutes"));
app.use("/api/stats", require("./routes/stats.routes"));
app.use("/api/calendar", require("./routes/calendar.routes"));
app.use("/api/settings", require("./routes/settings.routes"));

app.use("/api/notifications", require("./routes/notifications.routes"));
app.use("/api/activity", require("./routes/activity.routes"));

app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/pdfUpload", require("./routes/pdfUpload.routes"));

const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes);

// Health check
// 1) API & health check
// …
app.get("/api", (req, res) => res.send("✅ API up"));

// 2) Serve React build
const frontendPath = path.join(__dirname, "../portfolio-frontend/build");
app.use(express.static(frontendPath));

// 3) SPA fallback
app.get("*", (req, res) => {
  // don’t rewrite API calls
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
