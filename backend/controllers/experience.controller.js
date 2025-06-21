// controllers/experience.controller.js
const pool = require('../db');

// GET /api/experience
exports.getAllExperience = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experience WHERE user_id = 1 ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({ message: 'Failed to fetch experience' });
  }
};

// POST /api/experience
exports.addExperience = async (req, res) => {
  const { company_name, position, start_date, end_date, description } = req.body;

  if (!company_name || !position || !start_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO experience (user_id, company_name, position, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [1, company_name, position, start_date, end_date || null, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding experience:', err);
    res.status(500).json({ message: 'Failed to add experience' });
  }
};

// PUT /api/experience
exports.updateExperience = async (req, res) => {
  const { experiences } = req.body; // array of { company_name, position, ... }

  if (!Array.isArray(experiences)) {
    return res.status(400).json({ message: 'Invalid experiences array' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM experience WHERE user_id = 1');

    for (const exp of experiences) {
      const { company_name, position, start_date, end_date, description } = exp;
      await client.query(
        `INSERT INTO experience (user_id, company_name, position, start_date, end_date, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [1, company_name, position, start_date, end_date || null, description || null]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Experience updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating experience:', err);
    res.status(500).json({ message: 'Failed to update experience' });
  } finally {
    client.release();
  }
};

// DELETE /api/experience/:id
exports.deleteExperience = async (req, res) => {
  const experienceId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM experience WHERE id = $1 RETURNING *', [experienceId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json({ message: 'Experience deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting experience:', err);
    res.status(500).json({ message: 'Failed to delete experience' });
  }
};
