# Enterprise Dropshipping Management System

A comprehensive, enterprise-grade dropshipping management system built with NestJS backend and Next.js frontend.

## Features

### Backend (NestJS)
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Multi-role system (Admin, Manager, Staff) with permissions
- **Product Management**: Full CRUD operations with inventory tracking
- **Order Management**: Complete order lifecycle with status tracking
- **Customer Management**: Customer profiles with addresses and order history
- **Inventory Management**: Real-time inventory synchronization and low-stock alerts
- **Supplier Integration**: API integration capabilities for supplier management
- **Analytics & Reporting**: Comprehensive business intelligence dashboard
- **Email Notifications**: Automated customer and admin notifications
- **RESTful APIs**: Well-documented APIs with Swagger integration

### Frontend (Next.js)
- **Modern UI**: ShadCN UI components with professional design
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: Live dashboard with dynamic data visualization
- **Advanced Filtering**: Sophisticated search and filtering capabilities
- **Data Visualization**: Interactive charts and analytics using Recharts
- **State Management**: Zustand for efficient state management
- **Authentication**: Secure login/logout with token management
- **Role-based UI**: Dynamic interface based on user permissions

## Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: TypeORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator with DTOs
- **Documentation**: Swagger/OpenAPI
- **Security**: CORS, Helmet, Rate limiting
- **Testing**: Jest for unit and integration tests

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dropshipping-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run start:dev
   ```
   The backend will run on http://localhost:3000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:3001

3. **Access the application**
   - Frontend: http://localhost:3001
   - API Documentation: http://localhost:3000/api/docs

### Default Credentials

Create an admin user by registering at `/auth/register` with the following details:
- Email: admin@example.com
- Password: admin123
- The system will automatically assign the admin role

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── products/       # Product catalog
│   │   ├── orders/         # Order processing
│   │   ├── customers/      # Customer management
│   │   ├── inventory/      # Inventory tracking
│   │   ├── suppliers/      # Supplier integration
│   │   ├── analytics/      # Business analytics
│   │   └── notifications/  # Email notifications
│   ├── common/
│   │   ├── decorators/     # Custom decorators
│   │   ├── filters/        # Exception filters
│   │   ├── interceptors/   # Request/response interceptors
│   │   └── enums/          # Application enums
│   ├── config/             # Configuration files
│   └── main.ts             # Application entry point
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Protected dashboard pages
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── ui/             # ShadCN UI components
│   │   ├── layout/         # Layout components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── products/       # Product components
│   │   ├── orders/         # Order components
│   │   └── customers/      # Customer components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - User logout

### Products
- `GET /products` - List products with filtering
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /products/low-stock` - Get low stock products

### Orders
- `GET /orders` - List all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order
- `PATCH /orders/:id/status` - Update order status
- `GET /orders/status/:status` - Get orders by status

### Customers
- `GET /customers` - List customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer
- `POST /customers/:id/addresses` - Add customer address

### Analytics
- `GET /analytics/dashboard` - Get dashboard metrics
- `GET /analytics/revenue` - Get revenue analytics
- `GET /analytics/products` - Get product analytics
- `GET /analytics/customers` - Get customer analytics

## Database Schema

### Core Entities
- **User**: Authentication and user management
- **Customer**: Customer profiles and contact information
- **Product**: Product catalog with inventory tracking
- **Order**: Order management with status tracking
- **Address**: Customer shipping/billing addresses
- **Supplier**: Supplier information and API integration
- **InventoryLog**: Inventory change tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permission levels
- **Input Validation**: Comprehensive validation with class-validator
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **Password Hashing**: Bcrypt for secure password storage

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis integration for improved performance
- **Lazy Loading**: Frontend components loaded on demand
- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Automatic code splitting with Next.js

## Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set environment variables for production
3. Deploy to your preferred cloud provider (AWS, Google Cloud, Azure)
4. Configure database connection
5. Set up SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting platform
3. Configure environment variables
4. Set up custom domain (optional)

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret
DATABASE_PATH=database.sqlite
FRONTEND_URL=http://localhost:3001
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

- [ ] Multi-store support
- [ ] Advanced reporting with PDF exports
- [ ] Mobile application
- [ ] AI-powered inventory forecasting
- [ ] Advanced supplier integrations
- [ ] Multi-language support
- [ ] Advanced user permissions
- [ ] API webhooks for real-time updates