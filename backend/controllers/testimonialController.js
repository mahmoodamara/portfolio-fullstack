// controllers/testimonialController.js
const pool = require('../db');

// Get all testimonials (public)
exports.getAllTestimonials = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};

// Add a testimonial (admin)
exports.addTestimonial = async (req, res) => {
  try {
    const { name, image_url, job_title, feedback, rating } = req.body;

    if (!name || !image_url || !feedback || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO testimonials (name, image_url, job_title, feedback, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, image_url, job_title, feedback, rating]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error adding testimonial:', err);
    res.status(500).json({ message: 'Failed to add testimonial' });
  }
};


// Update a testimonial (admin)
exports.updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { name, image_url, job_title, feedback, rating } = req.body;
  try {
    const result = await pool.query(
      `UPDATE testimonials SET
        name = $1,
        image_url = $2,
        job_title = $3,
        feedback = $4,
        rating = $5
       WHERE id = $6 RETURNING *`,
      [name, image_url, job_title, feedback, rating, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ message: 'Failed to update testimonial' });
  }
};

// Delete a testimonial (admin)
exports.deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
};
