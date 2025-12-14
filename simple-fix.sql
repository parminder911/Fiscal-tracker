-- Simple fix - add missing columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create roles table if missing
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert roles if not exist
INSERT INTO roles (role_name) VALUES ('admin'), ('district'), ('tehsil'), ('sarpanch'), ('citizen')
ON CONFLICT (role_name) DO NOTHING;

-- Update existing users with default values
UPDATE users SET full_name = user_id WHERE full_name IS NULL;
UPDATE users SET role_id = (SELECT id FROM roles WHERE role_name = 'admin') WHERE role_id IS NULL;
UPDATE users SET is_active = TRUE WHERE is_active IS NULL;

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create login_history table
CREATE TABLE IF NOT EXISTS login_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(50),
  status VARCHAR(20)
);

-- Verify
SELECT 'Fix complete!' as status;
SELECT * FROM users LIMIT 1;
SELECT * FROM roles;
