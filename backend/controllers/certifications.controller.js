// controllers/certifications.controller.js
const pool = require('../db');

// GET /api/certifications
exports.getAllCertifications = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM certifications WHERE user_id = 1 ORDER BY issue_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching certifications:', err);
    res.status(500).json({ message: 'Failed to fetch certifications' });
  }
};

// POST /api/certifications
exports.addCertification = async (req, res) => {
  const { name, issuer, issue_date, credential_url } = req.body;

  if (!name || !issuer || !issue_date) {
    return res.status(400).json({ message: 'Missing required certification fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO certifications (user_id, name, issuer, issue_date, credential_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [1, name, issuer, issue_date, credential_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding certification:', err);
    res.status(500).json({ message: 'Failed to add certification' });
  }
};

// PUT /api/certifications
exports.updateCertifications = async (req, res) => {
  const { certifications } = req.body;

  if (!Array.isArray(certifications)) {
    return res.status(400).json({ message: 'Invalid certifications array' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM certifications WHERE user_id = 1');

    for (const cert of certifications) {
      const { name, issuer, issue_date, credential_url } = cert;
      await client.query(
        `INSERT INTO certifications (user_id, name, issuer, issue_date, credential_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [1, name, issuer, issue_date, credential_url || null]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Certifications updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating certifications:', err);
    res.status(500).json({ message: 'Failed to update certifications' });
  } finally {
    client.release();
  }
};

// DELETE /api/certifications/:id
exports.deleteCertification = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query('DELETE FROM certifications WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.status(200).json({ message: 'Certification deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting certification:', err);
    res.status(500).json({ message: 'Failed to delete certification' });
  }
};
