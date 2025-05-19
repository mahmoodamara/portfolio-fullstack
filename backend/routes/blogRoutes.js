// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Admin routes
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;