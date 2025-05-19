// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// تسجيل دخول الأدمن
router.post('/login', login);

// جلب بيانات الأدمن عبر التوكن
router.get('/me', authMiddleware, getProfile);

module.exports = router;
