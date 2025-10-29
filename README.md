# Dropshipping Management System

A fullstack dropshipping management system built with NestJS and Next.js.

## Tech Stack

### Backend
- NestJS
- SQLite with TypeORM
- JWT Authentication
- Swagger API Documentation

### Frontend
- Next.js 14
- shadcn/ui components
- Tailwind CSS
- TypeScript

## Features

- Product management
- Order tracking
- Supplier management
- Inventory management
- User authentication
- Dashboard analytics

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend; npm install
```

3. Install frontend dependencies:
```bash
cd frontend; npm install
```

### Development

Run both backend and frontend:
```bash
npm run dev
```

Or run individually:
```bash
# Backend (http://localhost:3001)
npm run dev:backend

# Frontend (http://localhost:3000)
npm run dev:frontend
```

## API Documentation

Once the backend is running, visit http://localhost:3001/api for Swagger documentation.