// routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route
router.get('/', getAllTestimonials);

// Admin routes
router.post('/', addTestimonial);
router.put('/:id', authMiddleware, updateTestimonial);
router.delete('/:id', authMiddleware, deleteTestimonial);

module.exports = router;
