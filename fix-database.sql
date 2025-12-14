-- ============================================
-- FIX DATABASE - DROP AND RECREATE
-- ============================================

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS grievances CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS villages CASCADE;
DROP TABLE IF EXISTS tehsils CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ============================================
-- 1. ROLES TABLE
-- ============================================
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (role_name, description) VALUES
('admin', 'Supreme admin with all permissions'),
('district', 'District level officer'),
('tehsil', 'Tehsil level officer'),
('sarpanch', 'Village Sarpanch'),
('citizen', 'Regular citizen');

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(15),
  role_id INTEGER REFERENCES roles(id),
  district_id INTEGER,
  tehsil_id INTEGER,
  village_id INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (user_id, password, full_name, email, phone, role_id, is_active) 
SELECT 'PFT2026', 'Pass@123', 'Admin User', 'admin@budget.punjab.gov.in', '9876543210', id, true
FROM roles WHERE role_name = 'admin';

-- ============================================
-- 3. DISTRICTS TABLE
-- ============================================
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  district_name VARCHAR(100) NOT NULL,
  state VARCHAR(50) DEFAULT 'Punjab',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Punjab districts
INSERT INTO districts (district_name, state) VALUES
('Amritsar', 'Punjab'),
('Bathinda', 'Punjab'),
('Firozpur', 'Punjab'),
('Faridkot', 'Punjab'),
('Gurdaspur', 'Punjab'),
('Hoshiarpur', 'Punjab'),
('Jalandhar', 'Punjab'),
('Kapurthala', 'Punjab'),
('Ludhiana', 'Punjab'),
('Mansa', 'Punjab'),
('Moga', 'Punjab'),
('Muktsar', 'Punjab'),
('Pathankot', 'Punjab'),
('Patiala', 'Punjab'),
('Rupnagar', 'Punjab'),
('Sangrur', 'Punjab'),
('Shaheed Bhagat Singh Nagar', 'Punjab'),
('Tarn Taran', 'Punjab');

-- ============================================
-- 4. TEHSILS TABLE
-- ============================================
CREATE TABLE tehsils (
  id SERIAL PRIMARY KEY,
  tehsil_name VARCHAR(100) NOT NULL,
  district_id INTEGER REFERENCES districts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. VILLAGES TABLE
-- ============================================
CREATE TABLE villages (
  id SERIAL PRIMARY KEY,
  village_name VARCHAR(100) NOT NULL,
  tehsil_id INTEGER REFERENCES tehsils(id),
  district_id INTEGER REFERENCES districts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. GRIEVANCES TABLE
-- ============================================
CREATE TABLE grievances (
  id SERIAL PRIMARY KEY,
  grievance_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  state VARCHAR(100) DEFAULT 'Punjab',
  district VARCHAR(100) NOT NULL,
  taluka VARCHAR(100),
  village VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  attachment_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. LOGIN HISTORY TABLE
-- ============================================
CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(50),
  status VARCHAR(20)
);

-- ============================================
-- 9. AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(200) NOT NULL,
  project_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  village_id INTEGER REFERENCES villages(id),
  district_id INTEGER REFERENCES districts(id),
  budget_allocated DECIMAL(15, 2),
  budget_utilized DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 11. DEPARTMENTS TABLE
-- ============================================
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_grievances_status ON grievances(status);
CREATE INDEX idx_grievances_email ON grievances(email);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ============================================
-- VERIFY SETUP
-- ============================================
SELECT 'Tables created successfully!' as status;
SELECT COUNT(*) as total_roles FROM roles;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_districts FROM districts;
SELECT * FROM users WHERE user_id = 'PFT2026';
