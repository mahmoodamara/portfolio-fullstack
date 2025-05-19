const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [projects, messages, blogs] = await Promise.all([
      db.query('SELECT id, title, created_at FROM projects ORDER BY created_at DESC LIMIT 5'),
      db.query('SELECT id, name, created_at FROM messages ORDER BY created_at DESC LIMIT 5'),
      db.query('SELECT id, title, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 5'),
    ]);

    const activities = [
      ...projects.rows.map(row => ({
        type: 'project',
        message: `Project "${row.title}" created`,
        time: row.created_at,
      })),
      ...messages.rows.map(row => ({
        type: 'message',
        message: `Message from "${row.name}" received`,
        time: row.created_at,
      })),
      ...blogs.rows.map(row => ({
        type: 'blog',
        message: `Blog post "${row.title}" published`,
        time: row.created_at,
      })),
    ];

    // ترتيب زمني
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({ activities });
  } catch (err) {
    console.error('Activity error:', err);
    res.status(500).json({ message: 'Error loading activities' });
  }
});

module.exports = router;
