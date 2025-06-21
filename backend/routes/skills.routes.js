// routes/skills.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  addSkill,
  updateSkills,
  deleteSkill
} = require('../controllers/skills.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', getAllSkills);

// Admin
router.post('/', authMiddleware, addSkill);
router.put('/', authMiddleware, updateSkills);
router.delete('/:id', authMiddleware, deleteSkill);

module.exports = router;
