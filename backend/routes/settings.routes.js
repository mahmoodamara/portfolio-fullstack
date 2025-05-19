const express = require('express');
const router = express.Router();
const db = require('../db');

// GET site settings
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error loading settings' });
  }
});

// PUT update settings
router.put('/', async (req, res) => {
  const { site_name, tagline, facebook, linkedin, twitter } = req.body;
  try {
    const result = await db.query(
      `UPDATE site_settings SET
        site_name = $1,
        tagline = $2,
        facebook = $3,
        linkedin = $4,
        twitter = $5
      WHERE id = (SELECT id FROM site_settings ORDER BY id DESC LIMIT 1)
      RETURNING *`,
      [site_name, tagline, facebook, linkedin, twitter]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;
