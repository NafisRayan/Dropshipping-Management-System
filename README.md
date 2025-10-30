# Dropshipping Management System

A comprehensive fullstack dropshipping management system built with modern web technologies. This application provides end-to-end management of dropshipping operations including product catalog, supplier management, order processing, inventory tracking, customer management, and analytics reporting.

## 🏗️ Architecture Overview

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM ORM
- **Authentication**: JWT-based with Passport.js
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator and class-transformer
- **Modules**: Modular architecture with separate modules for each domain

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React hooks
- **HTTP Client**: Axios

### Database Schema
The system uses SQLite with the following main entities:

#### Core Entities
- **Users**: System users with authentication
- **Customers**: End customers placing orders
- **Suppliers**: Product suppliers/vendors
- **Products**: Product catalog with variants and inventory
- **Orders**: Customer orders with items and shipments
- **Inventory Logs**: Stock movement tracking

#### Product Entity Fields
- Basic Info: name, description, SKU, category, brand
- Pricing: price, cost
- Inventory: stock, lowStockThreshold, isLowStock
- Media: imageUrl, imageUrls
- Physical: weight, dimensions
- Supplier Integration: supplierProductId, supplierSku
- Relations: supplier, variants, inventoryLogs, orderItems

## 🚀 Features

### Authentication & Security
- User registration and login
- JWT token-based authentication
- Protected API routes
- Password hashing with bcryptjs

### Product Management
- CRUD operations for products
- Product variants support
- Inventory tracking with low stock alerts
- Supplier association
- Image management
- Stock updates with logging

### Supplier Management
- Supplier CRUD operations
- Contact information management
- Product-supplier relationships

### Order Management
- Order creation and tracking
- Order status management
- Order items with quantities
- Shipment tracking
- Customer order history

### Customer Management
- Customer information management
- Order history tracking
- Customer analytics

### Reporting & Analytics
- Dashboard with key metrics
- Sales reports
- Inventory reports
- Supplier performance analytics

### Notifications
- System notifications
- Alert management

### Data Seeding
- Demo data generation for testing
- Sample products, suppliers, and orders

## 📋 Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dropshipping-management-system
```

### 2. Install Dependencies

#### Option A: Automatic Installation (Windows)
```bash
start-dynamic.bat
```
This script will automatically install all dependencies for root, backend, and frontend.

#### Option B: Manual Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## 🚀 Running the Application

### Quick Start (Recommended)
Run the full application with dynamic port detection:
```bash
npm run start:app
```
This command will:
- Find available ports for backend and frontend
- Create necessary environment files
- Start backend and frontend services sequentially
- Display access URLs when ready

### Alternative Methods

#### Concurrent Development Mode
```bash
npm run dev
```
Runs backend and frontend concurrently using fixed ports (3001 and 3000).

#### Individual Services
```bash
# Backend only (http://localhost:3001)
npm run dev:backend

# Frontend only (http://localhost:3000)
npm run dev:frontend
```

#### Windows Batch Files
```bash
# Dynamic port detection with dependency check
start-dynamic.bat

# Fixed ports in separate windows
start.bat
```

## 🌐 Access Points

After starting the application, access these endpoints:

- **Frontend Application**: http://localhost:3000 (or dynamic port)
- **Backend API**: http://localhost:3001 (or dynamic port)
- **API Documentation**: http://localhost:3001/api (Swagger UI)
- **Database**: SQLite file `backend/dropshipping.db`

## 📚 API Documentation

The backend provides comprehensive API documentation via Swagger:

1. Start the backend service
2. Visit `http://localhost:3001/api`
3. Explore available endpoints
4. Test API calls directly from the documentation

### Main API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### Products
- `GET /products` - List all products
- `POST /products` - Create new product
- `GET /products/:id` - Get product details
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `PATCH /products/:id/stock` - Update product stock

#### Suppliers
- `GET /suppliers` - List suppliers
- `POST /suppliers` - Create supplier
- `GET /suppliers/:id` - Get supplier details
- `PATCH /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

#### Orders
- `GET /orders` - List orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id` - Update order status

#### Customers
- `GET /customers` - List customers
- `POST /customers` - Create customer
- `GET /customers/:id` - Get customer details

#### Reports
- `GET /reports/dashboard` - Dashboard analytics
- `GET /reports/sales` - Sales reports
- `GET /reports/inventory` - Inventory reports

## 🗄️ Database

### SQLite Configuration
- **Database File**: `backend/dropshipping.db`
- **ORM**: TypeORM
- **Synchronization**: Automatic schema synchronization (development only)
- **Entities**: Auto-loaded from entity files

### Database Seeding
Populate the database with demo data:
```bash
# Via API endpoint
POST /seeder/demo-data

# Or use the seeder service programmatically
```

## 🔧 Development Scripts

### Root Package Scripts
```bash
npm run dev              # Run both services concurrently
npm run dev:backend      # Run backend only
npm run dev:frontend     # Run frontend only
npm run start:app        # Run with dynamic ports
npm run build            # Build both services
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend
```

### Backend Scripts
```bash
cd backend
npm run start:dev        # Development with watch mode
npm run start:prod       # Production build
npm run build            # Build for production
npm run test             # Run tests
npm run lint             # Run ESLint
```

### Frontend Scripts
```bash
cd frontend
npm run dev              # Development server
npm run build            # Build for production
npm run start            # Production server
npm run lint             # Run ESLint
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test             # Run unit tests
npm run test:watch       # Watch mode tests
npm run test:cov         # Tests with coverage
npm run test:e2e         # End-to-end tests
```

## 📁 Project Structure

```
dropshipping-management-system/
├── backend/                     # NestJS backend
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   ├── users/              # User management
│   │   ├── products/           # Product management
│   │   ├── suppliers/          # Supplier management
│   │   ├── orders/             # Order management
│   │   ├── customers/          # Customer management
│   │   ├── reports/            # Reporting module
│   │   ├── notifications/      # Notification system
│   │   ├── seeder/             # Data seeding
│   │   └── main.ts             # Application entry
│   ├── package.json
│   └── tsconfig.json
├── frontend/                    # Next.js frontend
│   ├── app/                    # App router pages
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities and API client
│   ├── package.json
│   └── tailwind.config.ts
├── start-dynamic.js            # Dynamic port starter
├── start-dynamic.bat           # Windows batch starter
├── package.json                # Root package config
└── README.md
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Input validation with class-validator
- CORS configuration
- Helmet security headers (configurable)

## 📊 Environment Variables

### Backend (.env)
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the UNLICENSED license.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   - Use `npm run start:app` for automatic port detection
   - Or manually change ports in environment files

2. **Database connection issues**
   - Ensure SQLite file permissions
   - Check if database file exists in `backend/` directory

3. **Dependency installation fails**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

4. **Frontend not connecting to backend**
   - Verify NEXT_PUBLIC_API_URL in frontend/.env.local
   - Check if backend is running on the specified port

### Getting Help

- Check the API documentation at `/api`
- Review the SETUP.md file for detailed setup instructions
- Check the terminal output for error messages