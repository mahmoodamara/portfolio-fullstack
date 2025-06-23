// controllers/projectController.js
const pool = require('../db');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  const { title, description, tech_stack, image_url, github_link, live_demo_link } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (title, description, tech_stack, image_url, github_link, live_demo_link)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, tech_stack, image_url, github_link, live_demo_link]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, tech_stack, image_url, github_link, live_demo_link } = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects SET title = $1, description = $2, tech_stack = $3, image_url = $4,
        github_link = $5, live_demo_link = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [title, description, tech_stack, image_url, github_link, live_demo_link, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

// Get project images
exports.getProjectImages = async (req, res) => {
  const { id } = req.params; // project ID
  try {
    const result = await pool.query(
      'SELECT * FROM project_images WHERE project_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching project images:', err);
    res.status(500).json({ message: 'Failed to fetch project images' });
  }
};

// Add image to project
exports.addProjectImage = async (req, res) => {
  const { id } = req.params; // project ID
  const { image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO project_images (project_id, image_url) VALUES ($1, $2) RETURNING *',
      [id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding project image:', err);
    res.status(500).json({ message: 'Failed to add project image' });
  }
};

// Delete project image
exports.deleteProjectImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    await pool.query('DELETE FROM project_images WHERE id = $1', [imageId]);
    res.json({ message: 'Project image deleted successfully' });
  } catch (err) {
    console.error('Error deleting project image:', err);
    res.status(500).json({ message: 'Failed to delete project image' });
  }
};