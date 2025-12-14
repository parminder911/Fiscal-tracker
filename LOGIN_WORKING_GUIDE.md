# Admin Login - Complete Working Guide

## ✅ Current Status

- ✅ Login API is working (simplified to check only user_id and password)
- ✅ Server is running on http://localhost:3000
- ❌ Database needs columns added (full_name, role_id, is_active)
- ❌ Login fails because database schema incomplete

---

## 🚀 Fix Database - 3 Options

### **Option 1: Using pgAdmin (EASIEST)**

1. Open pgAdmin (search "pgAdmin" in Windows)
2. Connect to PostgreSQL server
3. Navigate to: Databases → fiscal_tracker_db → Query Tool
4. Copy and paste SQL below
5. Click Execute button

### **Option 2: Using Command Line**

Open Command Prompt (NOT PowerShell) and run:

```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U postgres -d fiscal_tracker_db
```

Then paste the SQL commands below at the `postgres=#` prompt.

### **Option 3: Using DBeaver**

1. Open DBeaver
2. Connect to fiscal_tracker_db
3. Create new SQL script
4. Paste SQL below
5. Execute

---

## 📋 SQL Commands to Execute

Copy and paste ALL of this into your PostgreSQL client:

```sql
-- Add missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert roles
INSERT INTO roles (role_name) VALUES 
('admin'), ('district'), ('tehsil'), ('sarpanch'), ('citizen')
ON CONFLICT (role_name) DO NOTHING;

-- Update users with defaults
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

-- Verify admin user
SELECT * FROM users WHERE user_id = 'PFT2026';
```

---

## ✅ Expected Output

After executing, you should see:

```
id | user_id | password | full_name | role_id | is_active
---+---------+----------+-----------+---------+----------
 1 | PFT2026 | Pass@123 | PFT2026   |       1 | t
```

---

## 🔄 After Database Fix

### Step 1: Restart Server

In PowerShell terminal:

```powershell
# Stop current server (Ctrl+C)
# Then run:
npm run dev
```

### Step 2: Test Login

1. Open browser: http://localhost:3000
2. Enter:
   - **User ID:** `PFT2026`
   - **Password:** `Pass@123`
   - **Captcha:** Enter the 4-digit number shown
3. Click **Login**

### Step 3: Expected Result

✅ Login successful → Redirected to admin dashboard

---

## 🐛 Troubleshooting

### Error: "Invalid user ID or password"
- Database columns not added yet
- Execute SQL commands above
- Restart server

### Error: "column does not exist"
- Verify SQL executed successfully
- Check user exists: `SELECT * FROM users;`
- Restart server

### Error: "connection refused"
- PostgreSQL not running
- Start PostgreSQL service

---

## 📝 Quick Checklist

- [ ] Open pgAdmin or PostgreSQL client
- [ ] Copy SQL commands above
- [ ] Execute in Query Tool
- [ ] Verify user shows in result
- [ ] Restart `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Enter credentials
- [ ] Click Login
- [ ] See admin dashboard

---

## 🎯 Login Credentials

- **User ID:** `PFT2026`
- **Password:** `Pass@123`
- **Role:** Admin

---

## ✨ After Login Works

You can then:
- Access admin dashboard
- Manage users
- Manage grievances
- View reports
- Configure settings

---

**Status:** Database fix ready to execute
**Time to complete:** ~5 minutes
**Next step:** Execute SQL commands in PostgreSQL client
