# Quick Database Setup - Admin Login Fix

## 🚀 Run These Commands in Order

### Step 1: Verify PostgreSQL Connection (PowerShell)

```powershell
psql -U postgres -h localhost -p 5432
```

**Expected:** You should see `postgres=#` prompt
**If error:** PostgreSQL not running or wrong password

**To exit:** Type `\q` and press Enter

---

### Step 2: Create Database

```bash
createdb -U postgres fiscal_tracker_db
```

**Expected:** No error message (silent success)

---

### Step 3: Create All Tables (MOST IMPORTANT)

```bash
psql -U postgres -d fiscal_tracker_db -f database/setup.sql
```

**Expected Output:**
```
CREATE TABLE
INSERT 0 5
CREATE TABLE
INSERT 0 1
CREATE TABLE
INSERT 0 18
...
```

This creates:
- ✅ roles table (5 roles including admin)
- ✅ users table (with admin user PFT2026)
- ✅ districts table (18 Punjab districts)
- ✅ tehsils table
- ✅ villages table
- ✅ grievances table
- ✅ contact_messages table
- ✅ login_history table
- ✅ audit_log table (fixes "relation audit_log does not exist" error)
- ✅ projects table
- ✅ departments table

---

### Step 4: Verify Tables Created

```bash
psql -U postgres -d fiscal_tracker_db -c "\dt"
```

**Expected:** Should show 11 tables:
```
audit_log, contact_messages, departments, districts, grievances, 
login_history, projects, roles, tehsils, users, villages
```

---

### Step 5: Verify Admin User

```bash
psql -U postgres -d fiscal_tracker_db -c "SELECT * FROM users WHERE user_id = 'PFT2026';"
```

**Expected:** Shows admin user with:
- user_id: PFT2026
- password: Pass@123
- full_name: Admin User
- role_id: 1 (admin)

---

### Step 6: Clear Application Cache

```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next

# Or Linux/Mac
rm -rf .next
```

---

### Step 7: Start Application

```bash
npm run dev
```

**Expected:** Server starts on http://localhost:3000

---

### Step 8: Test Admin Login

1. Open browser: http://localhost:3000
2. Enter:
   - User ID: `PFT2026`
   - Password: `Pass@123`
   - Captcha: Enter the 4-digit number shown
3. Click Login

**Expected:** Login successful, redirected to admin dashboard

---

## ❌ If You Get Errors

### Error: "column role_id does not exist"

**Fix:** Run Step 3 again
```bash
psql -U postgres -d fiscal_tracker_db -f database/setup.sql
```

### Error: "relation audit_log does not exist"

**Fix:** Run Step 3 again (setup.sql creates this table)
```bash
psql -U postgres -d fiscal_tracker_db -f database/setup.sql
```

### Error: "password authentication failed"

**Fix:** PostgreSQL password is `1234`
```bash
psql -U postgres -d fiscal_tracker_db -W
# Enter password: 1234
```

### Error: "database does not exist"

**Fix:** Create database first
```bash
createdb -U postgres fiscal_tracker_db
```

### Error: "connection refused"

**Fix:** PostgreSQL not running
```powershell
# Start PostgreSQL service
Get-Service postgresql-x64-* | Start-Service
```

---

## 📋 What Gets Created

### Tables (11 total)
1. **roles** - User roles (admin, district, tehsil, sarpanch, citizen)
2. **users** - User accounts (includes admin user PFT2026)
3. **districts** - 18 Punjab districts
4. **tehsils** - Tehsil/Taluka locations
5. **villages** - Villages
6. **grievances** - Citizen grievances
7. **contact_messages** - Contact form submissions
8. **login_history** - Login tracking
9. **audit_log** - Activity audit (fixes the error!)
10. **projects** - Budget projects
11. **departments** - Departments

### Default Data
- **Admin User:** PFT2026 / Pass@123
- **Roles:** 5 roles created
- **Districts:** 18 Punjab districts inserted

---

## ✅ Verification Commands

```bash
# Check all tables exist
psql -U postgres -d fiscal_tracker_db -c "\dt"

# Check admin user exists
psql -U postgres -d fiscal_tracker_db -c "SELECT * FROM users WHERE user_id = 'PFT2026';"

# Check roles exist
psql -U postgres -d fiscal_tracker_db -c "SELECT * FROM roles;"

# Check districts exist
psql -U postgres -d fiscal_tracker_db -c "SELECT COUNT(*) FROM districts;"

# Check audit_log table exists
psql -U postgres -d fiscal_tracker_db -c "\d audit_log"
```

---

## 🎯 Complete Checklist

- [ ] Step 1: Verify PostgreSQL connection
- [ ] Step 2: Create database
- [ ] Step 3: Run setup.sql (creates all tables)
- [ ] Step 4: Verify tables created
- [ ] Step 5: Verify admin user exists
- [ ] Step 6: Clear .next cache
- [ ] Step 7: Start application
- [ ] Step 8: Test admin login

---

## 🔑 Login Credentials

**Admin User:**
- User ID: `PFT2026`
- Password: `Pass@123`

---

## 📞 Database Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** fiscal_tracker_db
- **User:** postgres
- **Password:** 1234

---

## ✨ After Login Works

You can then:
1. ✅ Access admin dashboard
2. ✅ File grievances (/grievance)
3. ✅ View about page (/about)
4. ✅ Contact support (/contact)
5. ✅ All features working

---

**Status:** Ready to execute
**Time to complete:** ~5 minutes
**Last Updated:** December 13, 2025
