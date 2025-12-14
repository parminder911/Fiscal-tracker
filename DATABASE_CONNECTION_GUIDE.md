# Database Connection & Setup Guide

## ✅ Step-by-Step Setup for Admin Login

This guide will help you establish database connection and create all necessary tables for the admin login portal.

---

## 📋 Step 1: Verify Database Connection

### Check PostgreSQL is Running

**Windows (PowerShell):**
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql-x64-* | Select-Object Status, Name

# Or try to connect
psql -U postgres -h localhost -p 5432
```

**Expected Output:**
```
postgres=#
```

If you see the prompt, connection is successful. Type `\q` to exit.

---

## 🗄️ Step 2: Create Database

### Create the Database

```bash
# Create database
createdb -U postgres fiscal_tracker_db

# Verify creation
psql -U postgres -l | grep fiscal_tracker_db
```

**Expected Output:**
```
 fiscal_tracker_db | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
```

---

## 📊 Step 3: Create All Required Tables

### Run the Setup Script

```bash
# Navigate to project directory
cd "c:\Users\Expert\Desktop\Punjab Transparency Portal\fiscal-tracker"

# Run setup script
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

---

## ✅ Step 4: Verify Tables Created

### Check All Tables

```bash
# List all tables
psql -U postgres -d fiscal_tracker_db -c "\dt"
```

**Expected Tables:**
```
              List of relations
 Schema |       Name        | Type  |  Owner
--------+-------------------+-------+----------
 public | audit_log         | table | postgres
 public | contact_messages  | table | postgres
 public | departments       | table | postgres
 public | districts         | table | postgres
 public | grievances        | table | postgres
 public | login_history     | table | postgres
 public | projects          | table | postgres
 public | roles             | table | postgres
 public | tehsils           | table | postgres
 public | users             | table | postgres
 public | villages          | table | postgres
```

### Check Admin User

```bash
psql -U postgres -d fiscal_tracker_db -c "SELECT * FROM users WHERE user_id = 'PFT2026';"
```

**Expected Output:**
```
 id | user_id | password | full_name  |           email            | phone      | role_id | district_id | tehsil_id | village_id | is_active |         created_at
----+---------+----------+------------+----------------------------+------------+---------+-------------+-----------+------------+-----------+---------------------
  1 | PFT2026 | Pass@123 | Admin User | admin@budget.punjab.gov.in | 9876543210 |       1 |             |           |            | t         | 2025-12-13 ...
```

### Check Roles

```bash
psql -U postgres -d fiscal_tracker_db -c "SELECT * FROM roles;"
```

**Expected Output:**
```
 id |      role_name       |              description
----+----------------------+---------------------------------------
  1 | admin                | Supreme admin with all permissions
  2 | district             | District level officer
  3 | tehsil               | Tehsil level officer
  4 | sarpanch             | Village Sarpanch
  5 | citizen              | Regular citizen
```

### Check Districts

```bash
psql -U postgres -d fiscal_tracker_db -c "SELECT COUNT(*) FROM districts;"
```

**Expected Output:**
```
 count
-------
    18
```

---

## 🔌 Step 5: Verify Application Connection

### Test Connection from Node.js

Create a test file `test-db.js`:

```javascript
import { pool } from './src/lib/db.js';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('Current time:', result.rows[0]);
    
    // Test admin user
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', ['PFT2026']);
    console.log('✅ Admin user found:', user.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
node test-db.js
```

**Expected Output:**
```
✅ Database connected successfully!
Current time: { now: 2025-12-13T... }
✅ Admin user found: { id: 1, user_id: 'PFT2026', ... }
```

---

## 🚀 Step 6: Start Application

### Clear Cache and Restart

```bash
# Clear Next.js cache
rm -rf .next

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
> next dev

  ▲ Next.js 16.0.8
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

---

## 🔐 Step 7: Test Admin Login

### Login to Homepage

1. **Open Browser:** http://localhost:3000
2. **Enter Credentials:**
   - User ID: `PFT2026`
   - Password: `Pass@123`
   - Captcha: Enter the displayed 4-digit number
3. **Click Login**

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to admin dashboard
- ✅ No database errors

---

## 🐛 Troubleshooting

### Error: "database does not exist"

**Solution:**
```bash
createdb -U postgres fiscal_tracker_db
```

### Error: "role_id does not exist"

**Solution:** Run setup script again
```bash
psql -U postgres -d fiscal_tracker_db -f database/setup.sql
```

### Error: "relation audit_log does not exist"

**Solution:** All tables are created by setup.sql. If missing, run:
```bash
psql -U postgres -d fiscal_tracker_db -f database/setup.sql
```

### Error: "password authentication failed"

**Solution:** Check PostgreSQL password
```bash
# Try with correct password
psql -U postgres -d fiscal_tracker_db -W
# Enter password: 1234
```

### Error: "connection refused"

**Solution:** PostgreSQL not running
```bash
# Windows - Start PostgreSQL service
net start postgresql-x64-15

# Or check service
Get-Service postgresql-x64-* | Start-Service
```

---

## 📋 Complete Setup Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `fiscal_tracker_db` created
- [ ] Setup script executed (`database/setup.sql`)
- [ ] All 11 tables created
- [ ] Admin user inserted (PFT2026)
- [ ] 5 roles created
- [ ] 18 districts created
- [ ] Database connection verified
- [ ] Application started (`npm run dev`)
- [ ] Admin login tested successfully

---

## 📊 Database Schema Summary

### Tables Created (11 total)

| Table | Purpose | Key Columns |
|-------|---------|------------|
| `roles` | User roles | id, role_name, description |
| `users` | User accounts | id, user_id, password, role_id, email |
| `districts` | Punjab districts | id, district_name, state |
| `tehsils` | Tehsil/Taluka | id, tehsil_name, district_id |
| `villages` | Villages | id, village_name, tehsil_id, district_id |
| `grievances` | Citizen grievances | id, grievance_id, name, email, message |
| `contact_messages` | Contact form submissions | id, name, email, subject, message |
| `login_history` | Login tracking | id, user_id, login_time, ip_address |
| `audit_log` | Activity audit | id, user_id, action, entity_type |
| `projects` | Budget projects | id, project_name, budget_allocated, status |
| `departments` | Departments | id, department_name, description |

---

## 🔑 Default Credentials

**Admin User:**
- User ID: `PFT2026`
- Password: `Pass@123`
- Role: Admin
- Email: admin@budget.punjab.gov.in

---

## 🔗 Connection Details

**Database Configuration:**
- Host: `localhost`
- Port: `5432`
- Database: `fiscal_tracker_db`
- User: `postgres`
- Password: `1234`

**Application Config File:** `src/lib/db.js`

---

## ✅ What You Can Do After Setup

1. ✅ Login as admin (PFT2026 / Pass@123)
2. ✅ File grievances
3. ✅ Contact support
4. ✅ View about page
5. ✅ Navigate all pages

---

## 📞 Quick Commands Reference

```bash
# Connect to database
psql -U postgres -d fiscal_tracker_db

# Run setup script
psql -U postgres -d fiscal_tracker_db -f database/setup.sql

# Check tables
psql -U postgres -d fiscal_tracker_db -c "\dt"

# Check admin user
psql -U postgres -d fiscal_tracker_db -c "SELECT * FROM users WHERE user_id = 'PFT2026';"

# Start application
npm run dev

# Clear cache
rm -rf .next
```

---

## 🎯 Next Steps

1. Run setup script
2. Verify tables created
3. Start application
4. Test admin login
5. Navigate to grievance page
6. File a test grievance
7. Check contact page
8. Verify all features work

---

**Status:** ✅ READY FOR SETUP
**Last Updated:** December 13, 2025
**Version:** 1.0
