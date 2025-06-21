// controllers/skills.controller.js
const pool = require('../db');

// GET /api/skills
exports.getAllSkills = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills WHERE user_id = 1 ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
};

// POST /api/skills
exports.addSkill = async (req, res) => {
  const { skill_name, level } = req.body;
  if (!skill_name || !level) {
    return res.status(400).json({ message: 'Missing skill_name or level' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO skills (user_id, skill_name, level) VALUES ($1, $2, $3) RETURNING *',
      [1, skill_name, level]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).json({ message: 'Failed to add skill' });
  }
};

// PUT /api/skills
exports.updateSkills = async (req, res) => {
  const { skills } = req.body; // array of { skill_name, level }

  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: 'Invalid skills data' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM skills WHERE user_id = 1');

    for (const skill of skills) {
      const { skill_name, level } = skill;
      await client.query(
        'INSERT INTO skills (user_id, skill_name, level) VALUES ($1, $2, $3)',
        [1, skill_name, level]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Skills updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating skills:', err);
    res.status(500).json({ message: 'Failed to update skills' });
  } finally {
    client.release();
  }
};

// DELETE /api/skills/:id
exports.deleteSkill = async (req, res) => {
  const skillId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING *', [skillId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json({ message: 'Skill deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ message: 'Failed to delete skill' });
  }
};
