// routes/pdfUpload.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// إعداد multer للتخزين المحلي
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9 ]/g, '').trim();
    cb(null, `${name}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // حد أقصى 5MB
});

// ✨ API لرفع ملف PDF
router.post('/pdf', upload.single('resume'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
    // ✅ إنشاء رابط كامل باستخدام البروتوكول والدومين
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  });
  

module.exports = router;
