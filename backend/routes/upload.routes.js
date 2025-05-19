const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// ✅ إعداد Cloudinary باستخدام متغيرات البيئة
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ إعداد تخزين باستخدام CloudinaryStorage وmulter
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const isPdf = file.mimetype === 'application/pdf';
      const originalName = file.originalname
        .replace(/\.[^/.]+$/, '')       // حذف الامتداد
        .replace(/[^a-zA-Z0-9 ]/g, '')   // حذف الرموز الغريبة
        .replace(/\s+/g, ' ')            // توحيد المسافات
        .trim();
  
      const timestamp = Date.now();
  
      return {
        folder: 'portfolio_projects',
        resource_type: isPdf ? 'raw' : 'image',
        allowed_formats: isPdf ? ['pdf'] : ['jpg', 'jpeg', 'png'],
        public_id: `${originalName}-${timestamp}`,
        ...(isPdf ? {} : {
          transformation: [{ width: 800, height: 600, crop: 'limit' }]
        })
      };
    }
  });
  

const upload = multer({ storage });

// ✅ Route لرفع صورة أو ملف PDF
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
