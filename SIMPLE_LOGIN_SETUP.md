# Simple Admin Login Setup

## ✅ What Changed

**Login API is now SIMPLE:**
- Only checks `user_id` and `password`
- No complex database queries
- No missing column errors
- Just returns token and redirects to admin dashboard

---

## 🚀 Execute These Commands

### Step 1: Stop server
Press `Ctrl+C` in terminal

---

### Step 2: Run database fix

```powershell
psql -U postgres -d fiscal_tracker_db -f simple-fix.sql
```

This adds missing columns to users table and creates missing tables.

---

### Step 3: Clear cache

```powershell
Remove-Item -Recurse -Force .next
```

---

### Step 4: Restart server

```powershell
npm run dev
```

---

### Step 5: Test Login

1. Open: http://localhost:3000
2. Enter:
   - User ID: `PFT2026`
   - Password: `Pass@123`
   - Captcha: Enter 4-digit number
3. Click Login

**Expected:** ✅ Login successful → Admin Dashboard

---

## 📝 Login API Code

```javascript
// Simple - only 3 columns
SELECT id, user_id, password FROM users WHERE user_id = $1

// Check password
if (user.password !== password) {
  return error
}

// Return token
return { success: true, token, user }
```

---

## ✨ Benefits

- ✅ No complex queries
- ✅ No missing column errors
- ✅ Fast login
- ✅ Works with any database schema
- ✅ Easy to manage in admin panel

---

**Status:** Ready to login
**Time:** ~1 minute
