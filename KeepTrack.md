Hi

Prompt Im using:

Build a fullstack enterprise-grade dropshipping management system using NestJS for the backend with RESTful APIs, TypeORM for database modeling, and SQLite as the development database. The frontend should be built using Next.js with ShadCN UI components for a modern, responsive interface. Implement core modules including user and role management with JWT-based authentication, product management with CRUD operations and supplier API integration, order management with status tracking and auto-forwarding, inventory synchronization via scheduled jobs, shipping and fulfillment tracking, customer management with order history, and reporting dashboards for analytics. The backend should use NestJS modules, DTOs, guards, and validation with class-validator, while the frontend should consume the REST API using Axios and include pages for dashboard, products, orders, customers, and authentication. Bonus features may include PDF invoice generation, email notifications, multi-store support, and webhook integration for real-time updates.

## AI Activity Log

### Session: October 29, 2025
- **Activity**: Initial project setup and core implementation
- **Completed Tasks**:
  - Set up project structure (backend/frontend folders)
  - Initialized NestJS backend with CLI
  - Installed backend dependencies (TypeORM, SQLite, JWT, class-validator, etc.)
  - Configured TypeORM with SQLite database
  - Implemented authentication module (User/Role entities, JWT auth, guards, DTOs)
  - Implemented product management (CRUD operations, DTOs, guards)
  - Implemented order management (CRUD with status tracking, DTOs)
  - Initialized Next.js frontend with ShadCN UI
  - Installed frontend dependencies (Axios, React Hook Form)
  - Created auth pages (login/register with JWT handling)
  - Built basic dashboard page
  - Integrated Axios for API calls
  - Added CORS support to backend
  - Created detailed README.md
  - Updated KeepTrack.md with activity log

- **Remaining Tasks**:
  - Implement inventory sync (scheduled jobs)
  - Implement shipping/fulfillment tracking
  - Implement customer module
  - Implement reporting API
  - Build products page with CRUD interface
  - Build orders page with status tracking
  - Build customers page
  - Implement bonus features (PDF invoices, email, multi-store, webhooks)

- **Technical Notes**:
  - Backend running on port 3000
  - Frontend running on port 3001
  - Database: SQLite (database.sqlite)
  - Auth: JWT with bcrypt hashing
  - UI: ShadCN components with Tailwind CSS
  - API endpoints protected with JWT guards