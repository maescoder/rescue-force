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
