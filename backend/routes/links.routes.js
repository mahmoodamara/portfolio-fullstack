// routes/links.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllLinks,
  addLink,
  updateLinks,
  deleteLink
} = require('../controllers/links.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', getAllLinks);

// Admin
router.post('/', authMiddleware, addLink);
router.put('/', authMiddleware, updateLinks);
router.delete('/:id', authMiddleware, deleteLink);

module.exports = router;
