// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// تحقق فوري عند تشغيل التطبيق
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL database successfully.");
    client.release(); // حرر الاتصال بعد التحقق
  })
  .catch(err => {
    console.error("❌ Failed to connect to PostgreSQL database:", err.message);
  });

module.exports = pool;
