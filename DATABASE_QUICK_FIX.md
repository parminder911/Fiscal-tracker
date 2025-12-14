# Quick Database Fix - Copy & Paste into PostgreSQL

## 🚀 Method 1: Using pgAdmin (Easiest)

1. Open pgAdmin
2. Connect to `fiscal_tracker_db`
3. Open Query Tool
4. Copy and paste the SQL below
5. Click Execute

---

## 📋 SQL to Execute

```sql
-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert roles
INSERT INTO roles (role_name) VALUES ('admin'), ('district'), ('tehsil'), ('sarpanch'), ('citizen')
ON CONFLICT (role_name) DO NOTHING;

-- Update users with default values
UPDATE users SET full_name = user_id WHERE full_name IS NULL;
UPDATE users SET role_id = 1 WHERE role_id IS NULL;
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
SELECT * FROM users WHERE user_id = 'PFT2026';
```

---

## ✅ Expected Result

After running the SQL, you should see:

```
id | user_id | password | full_name  | role_id | is_active
---+---------+----------+------------+---------+----------
 1 | PFT2026 | Pass@123 | PFT2026    |       1 | t
```

---

## 🔄 After Database Fix

1. Go back to terminal
2. Run: `npm run dev`
3. Open: http://localhost:3000
4. Login with:
   - User ID: `PFT2026`
   - Password: `Pass@123`
   - Captcha: Enter 4-digit number
5. Click Login

**Expected:** ✅ Login successful

---

## 📝 Steps

1. ✅ Open pgAdmin or PostgreSQL client
2. ✅ Copy SQL above
3. ✅ Execute in Query Tool
4. ✅ Verify result shows user
5. ✅ Restart `npm run dev`
6. ✅ Test login

---

**Status:** Ready to execute
**Time:** ~2 minutes
