// utils/create-missing-tables.js
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

const createMissingTablesAndInsertData = async () => {
  try {
    await pool.query(`
      -- יצירת טבלאות חסרות
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        skill_name VARCHAR(100) NOT NULL,
        level VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        company_name VARCHAR(100),
        position VARCHAR(100),
        start_date DATE,
        end_date DATE,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        institution VARCHAR(100),
        degree VARCHAR(100),
        field_of_study VARCHAR(100),
        start_year INTEGER,
        end_year INTEGER
      );

      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(100),
        issuer VARCHAR(100),
        issue_date DATE,
        credential_url TEXT
      );


      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        page_name VARCHAR(100),
        views INTEGER DEFAULT 0,
        last_viewed TIMESTAMP
      );
    `);

    await pool.query(`DELETE FROM projects;`);

    // הכנסת מידע לדוגמה (רק אם צריך – אפשר לעטוף בתנאי בעתיד)
    await pool.query(`
      INSERT INTO skills (user_id, skill_name, level) VALUES
        (1, 'Node.js', 'Advanced'),
        (1, 'Angular', 'Advanced'),
        (1, 'React', 'Advanced'),
        (1, 'MongoDB', 'Advanced'),
        (1, 'Java', 'Intermediate'),
        (1, 'C#', 'Intermediate'),
        (1, 'C++', 'Intermediate'),
        (1, 'SQL', 'Intermediate'),
        (1, 'JavaScript', 'Advanced');

      INSERT INTO experience (user_id, company_name, position, start_date, end_date, description) VALUES
        (1, 'Arab College for Practical Engineers', 'Technical Mentor', '2023-01-01', NULL, 'Mentored students in Java and Full-Stack development (Angular, Node.js, MongoDB). Conducted workshops and guided real-world projects.');

      INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year) VALUES
        (1, 'Tel-Hai College', 'B.Sc.', 'Computer Science', 2022, 2025),
        (1, 'Ort Braude College', 'Diploma', 'Software Engineering', 2020, 2022);

      INSERT INTO certifications (user_id, name, issuer, issue_date, credential_url) VALUES
        (1, 'Full-Stack Development Course', 'Zionet', '2022-07-01', NULL),
        (1, 'Advanced Java Course', 'BProgrammer', '2024-03-01', NULL);

     
    `);

    console.log("✅ Tables and sample data created successfully.");
  } catch (err) {
    console.error("❌ Error during setup:", err);
  }
};

// ייצוא הפונקציה לשימוש ב-server.js
module.exports = createMissingTablesAndInsertData;
