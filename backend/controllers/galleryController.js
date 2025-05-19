// controllers/galleryController.js
const pool = require('../db');

// Get all gallery images (public)
exports.getAllGallery = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ message: 'Failed to fetch gallery' });
  }
};

// Add a new gallery image (admin only)
exports.addGalleryImage = async (req, res) => {
  const { title, image_url, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO gallery (title, image_url, description) VALUES ($1, $2, $3) RETURNING *',
      [title, image_url, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding gallery image:', err);
    res.status(500).json({ message: 'Failed to add image' });
  }
};

// Update gallery image (admin only)
exports.updateGalleryImage = async (req, res) => {
  const { id } = req.params;
  const { title, image_url, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE gallery SET title = $1, image_url = $2, description = $3 WHERE id = $4 RETURNING *',
      [title, image_url, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating image:', err);
    res.status(500).json({ message: 'Failed to update image' });
  }
};

// Delete a gallery image (admin only)
exports.deleteGalleryImage = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};
