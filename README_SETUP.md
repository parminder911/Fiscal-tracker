# Fiscal Tracker - Setup Guide

## Overview
Fiscal Tracker is a transparency portal for government spending in Punjab. It allows public viewing of village funds and transaction status, department heads to approve/reject transactions, and admins to manage the system.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fiscal-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup PostgreSQL Database

#### Create Database
```bash
createdb fiscal-tracker2026
```

#### Run Schema
```bash
psql fiscal-tracker2026 < database/schema.sql
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fiscal-tracker2026
```

Replace `your_postgres_password` with your actual PostgreSQL password.

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── districts/    # Districts endpoints
│   │   ├── transactions/ # Transactions endpoints
│   │   └── users/        # Users management endpoints
│   ├── layout.js         # Root layout with Header/Footer
│   └── page.js           # Home page
├── components/
│   ├── Header/           # Navigation header
│   ├── Footer/           # Footer component
│   ├── Layout/           # Main layout wrapper
│   └── LoginPortal/      # Login page component
├── services/
│   └── locationService.js # API service for location data
└── lib/
    └── db.js             # PostgreSQL connection pool
```

## Features

### Public Dashboard
- View village funds and transaction status
- Browse districts of Punjab
- Track transaction history

### Department Head
- Approve/reject transactions
- Add comments to transactions
- View assigned district transactions

### Admin
- Create and manage department heads
- Assign villages to departments
- View all transactions and users
- Generate reports

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Districts
- `GET /api/districts` - Get all Punjab districts

### Transactions
- `GET /api/transactions` - Get transactions (with filters)
- `POST /api/transactions` - Create new transaction

### Users
- `GET /api/users` - Get users (with role filter)
- `POST /api/users` - Create new user

## Database Schema

### Tables
- **states** - Indian states
- **districts** - Districts within states
- **users** - System users (admin, department_head, public)
- **villages** - Villages within districts
- **transactions** - Financial transactions
- **department_heads** - Department head assignments

## Technologies Used
- Next.js 16.0.8
- React 19.2.1
- Bootstrap 5.3.0
- PostgreSQL
- Axios
- Node.js pg driver

## Development

### Build for Production
```bash
npm run build
npm start
```

### Code Style
- Use ES6+ syntax
- Follow React best practices
- Use CSS modules for component styling

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify credentials in `.env.local`
- Check database exists: `psql -l`

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Support
For issues or questions, please contact the development team.
