# Dropshipping Management System

A comprehensive fullstack enterprise-grade dropshipping management system designed to streamline operations for dropshipping businesses. Built with modern technologies for scalability, security, and maintainability.

## 🚀 Features

### Core Modules
- **User & Role Management**: JWT-based authentication with role-based access control (Admin/User)
- **Product Management**: Full CRUD operations with supplier API integration capabilities
- **Order Management**: Complete order lifecycle with status tracking and auto-forwarding
- **Inventory Synchronization**: Scheduled jobs for real-time inventory updates
- **Shipping & Fulfillment Tracking**: End-to-end shipment monitoring
- **Customer Management**: Customer profiles with order history
- **Reporting Dashboards**: Analytics and insights for business intelligence

### Bonus Features
- **PDF Invoice Generation**: Automated invoice creation
- **Email Notifications**: Integrated email system for alerts
- **Multi-Store Support**: Manage multiple dropshipping stores
- **Webhook Integration**: Real-time updates from suppliers

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: TypeORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Scheduling**: @nestjs/schedule for cron jobs
- **API**: RESTful APIs with OpenAPI documentation

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: ShadCN UI components
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: React hooks

## 📁 Project Structure

```
dropshipping-management-system/
├── backend/                          # NestJS backend
│   ├── src/
│   │   ├── auth/                     # Authentication module
│   │   │   ├── dto/                  # Login/Register DTOs
│   │   │   ├── jwt.strategy.ts       # JWT strategy
│   │   │   ├── jwt-auth.guard.ts     # Auth guard
│   │   │   └── auth.service.ts       # Auth business logic
│   │   ├── entities/                 # TypeORM entities
│   │   │   ├── user.entity.ts
│   │   │   ├── product.entity.ts
│   │   │   └── order.entity.ts
│   │   ├── products/                 # Product management
│   │   ├── orders/                   # Order management
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                      # App router pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── dashboard/
│   │   ├── components/
│   │   │   └── ui/                   # ShadCN components
│   │   └── lib/
│   └── package.json
├── KeepTrack.md                      # Development activity log
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NafisRayan/Dropshipping-Management-System.git
   cd dropshipping-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   Server will run on http://localhost:3000

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   App will run on http://localhost:3001

## 📡 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Product Endpoints
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Order Endpoints
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status
- `DELETE /orders/:id` - Delete order

## 🔧 Configuration

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```
DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=your-secret-key
PORT=3000
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚢 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@dropshipping-system.com or join our Discord community.

## 🙏 Acknowledgments

- NestJS for the excellent backend framework
- Next.js for the powerful frontend framework
- ShadCN for beautiful UI components
- All contributors and the open-source community