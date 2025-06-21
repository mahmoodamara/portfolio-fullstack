// routes/certifications.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllCertifications,
  addCertification,
  updateCertifications,
  deleteCertification
} = require('../controllers/certifications.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', getAllCertifications);

// Admin
router.post('/', authMiddleware, addCertification);
router.put('/', authMiddleware, updateCertifications);
router.delete('/:id', authMiddleware, deleteCertification);

module.exports = router;
