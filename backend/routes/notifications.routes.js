const express = require('express');
const router = express.Router();
const db = require('../db');

// GET latest notifications

router.get('/', async (req, res) => {
    try {
      const result = await db.query(
        'SELECT id, type, content, is_read, created_at FROM notifications ORDER BY created_at DESC LIMIT 10'
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      res.status(500).json({ message: 'Error loading notifications' });
    }
  });

// POST new notification
router.post('/', async (req, res) => {
  const { type, content } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO notifications (type, content) VALUES ($1, $2) RETURNING *`,
      [type, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Failed to insert notification:', err);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

// // PUT mark as read
// router.put('/:id/read', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await db.query(
//       `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
//       [id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update notification' });
//   }
// });

// Mark as read
router.put('/:id/read', async (req, res) => {
    const result = await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  });
  
  // Mark as unread
  router.put('/:id/unread', async (req, res) => {
    const result = await db.query('UPDATE notifications SET is_read = FALSE WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  });
  

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM notifications WHERE id = $1', [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Delete failed' });
    }
  });

  
  

module.exports = router;
