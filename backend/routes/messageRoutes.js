// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllMessages,
  sendMessage,
  deleteMessage,
  markAsRead,
  replyToMessage,
  getMessagesByEmail
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to send a message
router.post('/', sendMessage);

// Admin routes
router.get('/', authMiddleware, getAllMessages);
router.get("/user", getMessagesByEmail);

router.put('/:id/read', authMiddleware, markAsRead);
router.put('/:id/reply', authMiddleware, replyToMessage);

router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
