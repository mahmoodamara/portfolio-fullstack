// controllers/links.controller.js
const pool = require('../db');

// GET /api/links
exports.getAllLinks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM links_recommended WHERE user_id = 1 ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching links:', err);
    res.status(500).json({ message: 'Failed to fetch links' });
  }
};

// POST /api/links
exports.addLink = async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Missing title or url' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO links_recommended (user_id, title, url)
       VALUES ($1, $2, $3) RETURNING *`,
      [1, title, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding link:', err);
    res.status(500).json({ message: 'Failed to add link' });
  }
};

// PUT /api/links
exports.updateLinks = async (req, res) => {
  const { links } = req.body;

  if (!Array.isArray(links)) {
    return res.status(400).json({ message: 'Invalid links array' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM links_recommended WHERE user_id = 1');

    for (const link of links) {
      const { title, url } = link;
      await client.query(
        `INSERT INTO links_recommended (user_id, title, url)
         VALUES ($1, $2, $3)`,
        [1, title, url]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Links updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating links:', err);
    res.status(500).json({ message: 'Failed to update links' });
  } finally {
    client.release();
  }
};

// DELETE /api/links/:id
exports.deleteLink = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query('DELETE FROM links_recommended WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.status(200).json({ message: 'Link deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ message: 'Failed to delete link' });
  }
};
