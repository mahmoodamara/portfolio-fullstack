// controllers/blogController.js
const pool = require('../db');

// Get all blog posts (public)
exports.getAllPosts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ message: 'Failed to fetch blog posts' });
  }
};

// Get single blog post by ID (public)
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json({ message: 'Failed to fetch blog post' });
  }
};

// Add a blog post (admin)
exports.createPost = async (req, res) => {
  const { title, content, cover_image, tags, author } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO blog_posts (title, content, cover_image, tags, author)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, content, cover_image, tags, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({ message: 'Failed to create blog post' });
  }
};

// Update a blog post (admin)
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, cover_image, tags, author } = req.body;
  try {
    const result = await pool.query(
      `UPDATE blog_posts SET title = $1, content = $2, cover_image = $3,
        tags = $4, author = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [title, content, cover_image, tags, author, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).json({ message: 'Failed to update blog post' });
  }
};

// Delete a blog post (admin)
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.status(500).json({ message: 'Failed to delete blog post' });
  }
};
