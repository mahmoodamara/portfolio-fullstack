// routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllGallery,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage
} = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to view gallery
router.get('/', getAllGallery);



// Admin routes
router.post('/', authMiddleware, addGalleryImage);
router.put('/:id', authMiddleware, updateGalleryImage);

router.delete('/:id', authMiddleware, deleteGalleryImage);

module.exports = router;
