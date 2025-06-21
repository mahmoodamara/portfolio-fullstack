// controllers/analytics.controller.js
const pool = require('../db');

// GET /api/analytics
exports.getAllAnalytics = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analytics ORDER BY views DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// POST /api/analytics
// Increments view count or creates a new entry
exports.trackPageView = async (req, res) => {
  const { page_name } = req.body;

  if (!page_name) {
    return res.status(400).json({ message: 'Missing page_name' });
  }

  try {
    const existing = await pool.query('SELECT * FROM analytics WHERE page_name = $1', [page_name]);

    if (existing.rowCount > 0) {
      await pool.query(
        `UPDATE analytics
         SET views = views + 1, last_viewed = CURRENT_TIMESTAMP
         WHERE page_name = $1`,
        [page_name]
      );
    } else {
      await pool.query(
        `INSERT INTO analytics (page_name, views, last_viewed)
         VALUES ($1, 1, CURRENT_TIMESTAMP)`,
        [page_name]
      );
    }

    res.status(200).json({ message: 'Page view tracked' });
  } catch (err) {
    console.error('Error tracking page view:', err);
    res.status(500).json({ message: 'Failed to track analytics' });
  }
};

// DELETE /api/analytics/:page_name
exports.deleteAnalytics = async (req, res) => {
  const pageName = req.params.page_name;

  try {
    const result = await pool.query('DELETE FROM analytics WHERE page_name = $1 RETURNING *', [pageName]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json({ message: 'Analytics entry deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting analytics:', err);
    res.status(500).json({ message: 'Failed to delete analytics entry' });
  }
};
