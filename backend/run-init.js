// seed.js
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

const seedData = async () => {
  try {
    await pool.query(`
      INSERT INTO admins (username, email, password_hash)
      VALUES
        ('admin', 'admin@example.com', '$2b$10$testhashedpassword123456789');

      INSERT INTO projects (title, description, tech_stack, image_url, github_link, live_demo_link)
      VALUES
        ('Portfolio Website', 'A personal developer portfolio using React and Node.js', 'React,Node.js,PostgreSQL', 'https://via.placeholder.com/300', 'https://github.com/username/portfolio', 'https://portfolio.example.com'),

        ('E-commerce App', 'Online store built with MERN stack', 'MongoDB,Express,React,Node.js', 'https://via.placeholder.com/300', 'https://github.com/username/ecommerce', 'https://ecommerce.example.com');

      INSERT INTO messages (name, email, message)
      VALUES
        ('John Doe', 'john@example.com', 'Great website!'),
        ('Jane Smith', 'jane@example.com', 'I am interested in your services.');

      INSERT INTO about_info (full_name, bio, location, email, phone, profile_image, resume_url, github_link, linkedin_link, whatsapp_link, twitter_link)
      VALUES (
        'Mahmood Amara',
        'Full-stack developer with a passion for building modern web applications.',
        'Jerusalem, Palestine',
        'mahmood@example.com',
        '+972500000000',
        'https://via.placeholder.com/150',
        'https://example.com/resume.pdf',
        'https://github.com/mahmood',
        'https://linkedin.com/in/mahmood',
        'https://wa.me/972500000000',
        'https://twitter.com/mahmood'
      );

      INSERT INTO testimonials (name, image_url, job_title, feedback, rating)
      VALUES
        ('Client One', 'https://via.placeholder.com/100', 'CTO at TechCorp', 'Amazing experience working with Mahmood!', 5.0),
        ('Client Two', 'https://via.placeholder.com/100', 'Manager at SoftInc', 'Delivered the project ahead of schedule.', 4.5);
    `);

    console.log("✅ Test data inserted successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting seed data:", err);
    process.exit(1);
  }
};

seedData();