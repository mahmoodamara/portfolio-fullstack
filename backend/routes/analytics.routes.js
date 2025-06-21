// routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllAnalytics,
  trackPageView,
  deleteAnalytics
} = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public - track view
router.post('/', trackPageView);

// Admin - get analytics + delete entry
router.get('/', authMiddleware, getAllAnalytics);
router.delete('/:page_name', authMiddleware, deleteAnalytics);

module.exports = router;
