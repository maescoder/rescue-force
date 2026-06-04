CREATE DATABASE IF NOT EXISTS pet_rescue ;
USE pet_rescue;

CREATE TABLE IF NOT EXISTS animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age VARCHAR(50),
  species VARCHAR(50),
  story TEXT,
  image_path VARCHAR(255),
  rescued_on DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50),
  location VARCHAR(255) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  rescuer_name VARCHAR(100),
  details TEXT,
  urgency ENUM('Low','Medium','High') DEFAULT 'Low',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS adoptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicant_name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(60),
  pet_type VARCHAR(50),
  experience VARCHAR(50),
  living_situation VARCHAR(80),
  additional_info TEXT,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stats (
  stat_key VARCHAR(50) PRIMARY KEY,
  stat_value BIGINT DEFAULT 0
);

-- initialize counter; change the number if you want
INSERT INTO stats (stat_key, stat_value) VALUES ('rescued_count', 672)
  ON DUPLICATE KEY UPDATE stat_value = VALUES(stat_value);
USE pet_rescue;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin account
-- Username: admin
-- Password: adminpassword123
INSERT IGNORE INTO admins (username, password_hash) 
VALUES ('admin', '$2y$10$T1K.S7oN9m8bM0uWk/7.0.D4z6tJ5Kj2C1WjXQkC1cRk1Vf6Z5WbK');
USE pet_rescue;

ALTER TABLE reports 
ADD COLUMN latitude DECIMAL(10, 8) NULL AFTER location,
ADD COLUMN longitude DECIMAL(11, 8) NULL AFTER latitude;
