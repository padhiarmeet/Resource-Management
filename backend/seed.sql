CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delete existing to avoid duplicates if re-run
TRUNCATE TABLE users RESTART IDENTITY;

INSERT INTO users (name, email, role, password, created_at) VALUES 
('System Admin', 'admin@example.com', 'admin', 'admin123', NOW()),
('John Doe', 'john.faculty@example.com', 'faculty', 'faculty123', NOW()),
('Jane Smith', 'jane.faculty@example.com', 'faculty', 'faculty123', NOW()),
('Alice Student', 'alice.student@example.com', 'student', 'student123', NOW()),
('Bob Student', 'bob.student@example.com', 'student', 'student123', NOW()),
('Mike Maintenance', 'mike.maintenance@example.com', 'maintenance', 'maintenance123', NOW());
