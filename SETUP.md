# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. **Install root dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

3. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Option 1: Use the batch file (Windows)
```bash
start.bat
```

### Option 2: Manual startup

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: Concurrent (from root)
```bash
npm run dev
```

## Access Points

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/api

## Default Test Account

You can register a new account or use these test credentials once you create them:
- Email: admin@example.com
- Password: password123

## Features Available

1. **Authentication System**
   - User registration and login
   - JWT-based authentication
   - Protected routes

2. **Dashboard**
   - Overview statistics
   - Quick navigation

3. **Product Management**
   - Add/view products
   - Inventory tracking
   - Supplier association

4. **Supplier Management**
   - Add/manage suppliers
   - Contact information
   - Product relationships

5. **Order Management**
   - View orders
   - Update order status
   - Track order details

## Database

The system uses SQLite database (`dropshipping.db`) which will be created automatically when you first run the backend.

## Next Steps

1. Start the application
2. Register a new account
3. Add your first supplier
4. Add products from that supplier
5. View the dashboard for overview

The system is now ready for development and testing!