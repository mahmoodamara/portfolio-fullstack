// routes/experience.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllExperience,
  addExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experience.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', getAllExperience);

// Admin
router.post('/', authMiddleware, addExperience);
router.put('/', authMiddleware, updateExperience);
router.delete('/:id', authMiddleware, deleteExperience);

module.exports = router;
