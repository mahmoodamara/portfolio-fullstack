const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL client

// 📁 عدد المشاريع
router.get('/projects-count', async (req, res) => {
  const result = await db.query('SELECT COUNT(*) FROM projects');
  res.json({ count: parseInt(result.rows[0].count) });
});

// 📬 عدد الرسائل
router.get('/messages-count', async (req, res) => {
  const result = await db.query('SELECT COUNT(*) FROM messages');
  res.json({ count: parseInt(result.rows[0].count) });
});

// 📝 عدد المقالات
router.get('/blog-count', async (req, res) => {
    const result = await db.query('SELECT COUNT(*) FROM blog_posts');
    res.json({ count: parseInt(result.rows[0].count) });
  });
// 🌟 عدد التوصيات
router.get('/testimonials-count', async (req, res) => {
  const result = await db.query('SELECT COUNT(*) FROM testimonials');
  res.json({ count: parseInt(result.rows[0].count) });
});

// عدد المشاريع لكل شهر (آخر 6 أشهر)
router.get('/projects-per-month', async (req, res) => {
    const result = await db.query(`
      SELECT TO_CHAR(created_at, 'Mon') AS month, COUNT(*) AS count
      FROM projects
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY MIN(created_at)
    `);
    res.json(result.rows);
  });
  
  // عدد الرسائل لكل شهر
  router.get('/messages-per-month', async (req, res) => {
    const result = await db.query(`
      SELECT TO_CHAR(created_at, 'Mon') AS month, COUNT(*) AS count
      FROM messages
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY MIN(created_at)
    `);
    res.json(result.rows);
  });

module.exports = router;
