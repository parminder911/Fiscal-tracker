# Fix Login - Execute These Commands NOW

## 🚨 Problem
Database is missing columns: `full_name`, `role_id`, `is_active`
Missing tables: `audit_log`, `login_history`

## ✅ Solution - 2 Steps

### Step 1: Stop the server
Press `Ctrl+C` in the terminal

---

### Step 2: Run the simple fix script

```powershell
psql -U postgres -d fiscal_tracker_db -f simple-fix.sql
```

**Expected Output:**
```
ALTER TABLE
ALTER TABLE
ALTER TABLE
CREATE TABLE
INSERT 0 5
INSERT 0 1
INSERT 0 1
CREATE TABLE
CREATE TABLE
Fix complete!
```

---

### Step 3: Clear cache and restart

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

### Step 4: Test login

- URL: http://localhost:3000
- User ID: `PFT2026`
- Password: `Pass@123`
- Captcha: Enter 4-digit number
- Click Login

**Expected:** ✅ Login successful

---

## 📋 What Gets Fixed

| Issue | Fix |
|-------|-----|
| Missing `full_name` column | ✅ Added to users table |
| Missing `role_id` column | ✅ Added to users table |
| Missing `is_active` column | ✅ Added to users table |
| Missing `roles` table | ✅ Created with 5 roles |
| Missing `audit_log` table | ✅ Created |
| Missing `login_history` table | ✅ Created |
| Existing users without values | ✅ Updated with defaults |

---

**Time:** ~1 minute
**Status:** Ready to execute
