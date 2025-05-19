// controllers/messageController.js
const pool = require('../db');

// Get all messages (admin)
exports.getAllMessages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Submit a new message (public)
exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Delete a message (admin)
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};


// controllers/messageController.js
exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('UPDATE messages SET is_read = TRUE WHERE id = $1', [id]);
      res.json({ message: 'Message marked as read' });
    } catch (err) {
      console.error('Error updating message:', err);
      res.status(500).json({ message: 'Failed to update message' });
    }
  };
  

  // Admin reply to a message
exports.replyToMessage = async (req, res) => {
    const { id } = req.params;
    const { admin_reply } = req.body;
  
    try {
      await pool.query(
        'UPDATE messages SET admin_reply = $1 WHERE id = $2',
        [admin_reply, id]
      );
      res.json({ message: 'Reply sent successfully' });
    } catch (err) {
      console.error('Error replying to message:', err);
      res.status(500).json({ message: 'Failed to send reply' });
    }
  };
  
  // Get messages by user email (public)
exports.getMessagesByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE email = $1 ORDER BY created_at ASC',
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages by email:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
