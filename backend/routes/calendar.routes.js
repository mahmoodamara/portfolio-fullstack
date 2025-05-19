const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [projects, blogs, messages] = await Promise.all([
      db.query(`SELECT title, created_at FROM projects ORDER BY created_at DESC LIMIT 10`),
      db.query(`SELECT title, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 10`),
      db.query(`SELECT name, created_at FROM messages ORDER BY created_at DESC LIMIT 10`)
    ]);

    const events = [
      ...projects.rows.map((p) => ({
        title: `🗂 Project: ${p.title}`,
        start: p.created_at,
        end: p.created_at,
      })),
      ...blogs.rows.map((b) => ({
        title: `✍️ Blog: ${b.title}`,
        start: b.created_at,
        end: b.created_at,
      })),
      ...messages.rows.map((m) => ({
        title: `📩 Message from ${m.name}`,
        start: m.created_at,
        end: m.created_at,
      })),
    ];

    res.json(events);
  } catch (err) {
    console.error('📅 Calendar API error:', err);
    res.status(500).json({ message: 'Server error loading calendar events' });
  }
});

module.exports = router;
