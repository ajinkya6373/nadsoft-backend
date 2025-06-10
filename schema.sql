-- Drop tables if they already exist
DROP TABLE IF EXISTS students;
-- DROP TABLE IF EXISTS marks;

-- Create students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Create marks table with foreign key
-- CREATE TABLE marks (
--   id SERIAL PRIMARY KEY,
--   student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
--   subject VARCHAR(100) NOT NULL,
--   score INTEGER CHECK (score >= 0 AND score <= 100),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
