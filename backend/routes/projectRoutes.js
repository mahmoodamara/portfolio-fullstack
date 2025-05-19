// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Public - Get all projects
router.get('/', getAllProjects);

// Admin protected routes
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;