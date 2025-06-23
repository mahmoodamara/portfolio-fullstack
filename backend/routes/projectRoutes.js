// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectImages,
  addProjectImage,    // ← נוספה
  deleteProjectImage  // ← נוספה
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Public - Get all projects
router.get('/', getAllProjects);

// Public - Get images for specific project
router.get('/:id/images', getProjectImages);

// Admin protected routes - Projects
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

// Admin protected routes - Project Images
router.post('/:id/images', authMiddleware, addProjectImage);    // ← נתיב חדש
router.delete('/images/:imageId', authMiddleware, deleteProjectImage); // ← נתיב חדש

module.exports = router;