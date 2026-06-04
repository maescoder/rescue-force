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
