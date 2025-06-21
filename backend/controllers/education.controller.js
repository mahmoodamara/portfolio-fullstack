// controllers/education.controller.js
const pool = require('../db');

// GET /api/education
exports.getAllEducation = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM education WHERE user_id = 1 ORDER BY start_year DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching education:', err);
    res.status(500).json({ message: 'Failed to fetch education' });
  }
};

// POST /api/education
exports.addEducation = async (req, res) => {
  const { institution, degree, field_of_study, start_year, end_year } = req.body;

  if (!institution || !degree || !field_of_study || !start_year) {
    return res.status(400).json({ message: 'Missing required education fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [1, institution, degree, field_of_study, start_year, end_year || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding education:', err);
    res.status(500).json({ message: 'Failed to add education' });
  }
};

// PUT /api/education
exports.updateEducation = async (req, res) => {
  const { education } = req.body; // array of education records

  if (!Array.isArray(education)) {
    return res.status(400).json({ message: 'Invalid education array' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM education WHERE user_id = 1');

    for (const ed of education) {
      const { institution, degree, field_of_study, start_year, end_year } = ed;
      await client.query(
        `INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [1, institution, degree, field_of_study, start_year, end_year || null]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Education updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating education:', err);
    res.status(500).json({ message: 'Failed to update education' });
  } finally {
    client.release();
  }
};

// DELETE /api/education/:id
exports.deleteEducation = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query('DELETE FROM education WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    res.status(200).json({ message: 'Education entry deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting education:', err);
    res.status(500).json({ message: 'Failed to delete education' });
  }
};
