# Execute These Commands NOW - Fix Admin Login

## 🚨 Problem
The `users` table is missing the `role_id` column. The setup.sql script needs to be executed properly.

---

## ✅ Solution - Execute in PowerShell

### Step 1: Stop the running server
```
Press Ctrl+C in the terminal where npm run dev is running
```

---

### Step 2: Drop and recreate database

```powershell
psql -U postgres -d fiscal_tracker_db -f fix-database.sql
```

**Expected Output:**
```
DROP TABLE
DROP TABLE
...
CREATE TABLE
INSERT 0 5
INSERT 0 1
INSERT 0 18
...
Tables created successfully!
 total_roles
-------------
           5
(1 row)

 total_users
-------------
           1
(1 row)

 total_districts
-------------
              18
(1 row)

 id | user_id | password | full_name  | email                      | phone      | role_id | ...
----+---------+----------+------------+----------------------------+------------+---------+
  1 | PFT2026 | Pass@123 | Admin User | admin@budget.punjab.gov.in | 9876543210 |       1 | ...
```

---

### Step 3: Clear Next.js cache (Windows PowerShell)

```powershell
Remove-Item -Recurse -Force .next
```

---

### Step 4: Restart the application

```powershell
npm run dev
```

**Expected Output:**
```
   ▲ Next.js 16.0.8 (Turbopack)
   - Local:         http://localhost:3000
   - Network:       http://10.243.1.98:3000

 ✓ Ready in X.Xs
```

---

### Step 5: Test Admin Login

1. Open browser: http://localhost:3000
2. Enter:
   - User ID: `PFT2026`
   - Password: `Pass@123`
   - Captcha: Enter the 4-digit number shown
3. Click Login

**Expected:** Login successful ✅

---

## 📋 Summary of What Gets Fixed

| Issue | Fix |
|-------|-----|
| "column role_id does not exist" | ✅ Added role_id column to users table |
| "relation audit_log does not exist" | ✅ Created audit_log table |
| Missing roles | ✅ Created 5 roles (admin, district, tehsil, sarpanch, citizen) |
| Missing admin user | ✅ Created admin user (PFT2026 / Pass@123) |
| Missing districts | ✅ Created 18 Punjab districts |

---

## 🔑 After Login Works

You can then access:
- ✅ Admin dashboard
- ✅ Grievance page (/grievance)
- ✅ About page (/about)
- ✅ Contact page (/contact)

---

**Status:** Ready to execute
**Time:** ~2 minutes
