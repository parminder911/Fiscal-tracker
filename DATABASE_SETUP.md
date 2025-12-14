# Budget Transparency Portal - Database Setup Guide

## Prerequisites

- PostgreSQL 12 or higher
- psql command-line tool
- Database user with CREATE privileges

## Step 1: Create Database

```bash
createdb fiscal_tracker_db
```

## Step 2: Create Tables

```bash
psql -U postgres -d fiscal_tracker_db -f database/budget_portal_schema.sql
```

## Step 3: Initialize Data

```bash
psql -U postgres -d fiscal_tracker_db -f database/init_data.sql
```

## Step 4: Verify Installation

```bash
psql -U postgres -d fiscal_tracker_db

# Run these queries to verify:
SELECT COUNT(*) FROM districts;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM users;
```

## Database Schema Overview

### Core Tables

1. **users** - System users (Admin, District, Tehsil, Sarpanch)
   - user_id: Unique identifier (e.g., PFT2026)
   - password: Hashed password
   - role_id: References roles table
   - permissions: JSONB for role-based permissions

2. **projects** - Government projects
   - project_code: Unique code (e.g., PFT0001)
   - total_budget: Total allocated budget
   - allocated_budget: Amount allocated
   - utilized_budget: Amount spent
   - status: pending, approved, objection, rejected

3. **approval_workflow** - Project approval tracking
   - current_level: sarpanch, tehsil, district, admin
   - status: pending, approved, rejected, objection
   - Tracks project movement through approval hierarchy

4. **grievances** - Citizen complaints and issues
   - grievance_id: Unique identifier
   - status: open, in_progress, resolved
   - Tracks citizen feedback

5. **audit_log** - All system actions
   - Tracks user actions for compliance
   - Records all data changes

### Location Hierarchy

- **districts** (18 Punjab districts)
- **tehsils** (Sub-divisions within districts)
- **villages** (Villages within tehsils)

### Budget Tracking

- **budget_allocations** - When funds are allocated
- **budget_utilization** - When funds are spent
- **budget_summary** - Fiscal year summaries

## Default Admin User

```
User ID: PFT2026
Password: Pass@123
Role: Admin
```

## Environment Variables

Create `.env.local`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/fiscal_tracker_db
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## SQL Commands for Common Tasks

### Add New User

```sql
INSERT INTO users (user_id, password, full_name, role_id, email, phone, is_active)
VALUES ('PFT2027', 'hashed_password', 'Officer Name', 2, 'email@example.com', '9876543210', TRUE);
```

### Create New Project

```sql
INSERT INTO projects (project_name, project_code, description, department_id, village_id, district_id, total_budget, status, created_by)
VALUES ('Project Name', 'PFT0007', 'Description', 1, 1, 1, 5000000, 'pending', 1);
```

### View Pending Approvals

```sql
SELECT * FROM pending_approvals WHERE status = 'pending';
```

### View District Budget Summary

```sql
SELECT * FROM district_budget_summary;
```

### View Project Status

```sql
SELECT * FROM project_status_summary;
```

## Backup and Restore

### Backup Database

```bash
pg_dump -U postgres fiscal_tracker_db > backup.sql
```

### Restore Database

```bash
psql -U postgres -d fiscal_tracker_db < backup.sql
```

## Performance Optimization

All tables have appropriate indexes:
- User lookups by user_id
- Project lookups by status, district, village
- Approval workflow by project and status
- Grievances by status and user

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql -U postgres -d fiscal_tracker_db -c "SELECT 1"
```

### Reset Database

```bash
dropdb fiscal_tracker_db
createdb fiscal_tracker_db
psql -U postgres -d fiscal_tracker_db -f database/budget_portal_schema.sql
psql -U postgres -d fiscal_tracker_db -f database/init_data.sql
```

### Check Table Structure

```sql
\d projects
\d users
\d approval_workflow
```

## Next Steps

1. Configure environment variables
2. Run database initialization
3. Test API endpoints
4. Deploy to production

For more details, see the main README.md
