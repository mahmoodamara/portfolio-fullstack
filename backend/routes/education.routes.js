// routes/education.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllEducation,
  addEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/education.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', getAllEducation);

// Admin
router.post('/', authMiddleware, addEducation);
router.put('/', authMiddleware, updateEducation);
router.delete('/:id', authMiddleware, deleteEducation);

module.exports = router;
