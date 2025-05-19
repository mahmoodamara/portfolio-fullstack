// routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAboutInfo,
  updateAboutInfo
} = require('../controllers/aboutController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to get about info
router.get('/', getAboutInfo);

// Admin route to update about info
router.put('/', authMiddleware, updateAboutInfo);

module.exports = router;
