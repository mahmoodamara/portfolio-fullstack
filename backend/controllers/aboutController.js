// controllers/aboutController.js
const pool = require('../db');

// Get about info (public)
exports.getAboutInfo = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about_info LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching about info:', err);
    res.status(500).json({ message: 'Failed to fetch about info' });
  }
};

// Update about info (admin only)
exports.updateAboutInfo = async (req, res) => {
  const {
    full_name,
    bio,
    location,
    email,
    phone,
    profile_image,
    resume_url,
    github_link,
    linkedin_link,
    whatsapp_link,
    twitter_link
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE about_info SET
        full_name = $1,
        bio = $2,
        location = $3,
        email = $4,
        phone = $5,
        profile_image = $6,
        resume_url = $7,
        github_link = $8,
        linkedin_link = $9,
        whatsapp_link = $10,
        twitter_link = $11
       WHERE id = 1 RETURNING *`,
      [
        full_name,
        bio,
        location,
        email,
        phone,
        profile_image,
        resume_url,
        github_link,
        linkedin_link,
        whatsapp_link,
        twitter_link
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating about info:', err);
    res.status(500).json({ message: 'Failed to update about info' });
  }
};
