# Deployment Guide - Enterprise Dropshipping Management System

## Overview

This guide provides detailed instructions for deploying the Enterprise Dropshipping Management System to production environments.

## Deployment Options

### 1. Local Development
For development and testing purposes.

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

### 2. Docker Deployment
Recommended for production environments.

#### Backend Dockerfile
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

#### Frontend Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3001

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/dropshipping
    depends_on:
      - postgres
    volumes:
      - ./backend/logs:/app/logs

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3000
    depends_on:
      - backend

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=dropshipping
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 3. Cloud Deployment

#### AWS Deployment

1. **EC2 Instance Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone <your-repository-url>
   cd dropshipping-management-system
   
   # Install dependencies
   npm run install:all
   
   # Build applications
   npm run build
   ```

3. **PM2 Configuration**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: 'dropshipping-backend',
         script: 'backend/dist/main.js',
         instances: 'max',
         exec_mode: 'cluster',
         env: {
           NODE_ENV: 'production',
           PORT: 3000
         }
       },
       {
         name: 'dropshipping-frontend',
         script: 'frontend/node_modules/.bin/next',
         args: 'start -p 3001',
         instances: 'max',
         exec_mode: 'cluster',
         env: {
           NODE_ENV: 'production'
         }
       }
     ]
   }
   ```

4. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

#### Google Cloud Platform

1. **App Engine Deployment**
   ```yaml
   # app.yaml
   runtime: nodejs18
   
   env_variables:
     NODE_ENV: production
     DATABASE_URL: your-database-url
   
   automatic_scaling:
     min_instances: 1
     max_instances: 10
   ```

2. **Deploy**
   ```bash
   gcloud app deploy
   ```

#### Azure Deployment

1. **Azure App Service**
   ```bash
   # Install Azure CLI
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # Login to Azure
   az login
   
   # Create resource group
   az group create --name dropshipping-rg --location eastus
   
   # Create app service plan
   az appservice plan create --name dropshipping-plan --resource-group dropshipping-rg --sku B1
   
   # Create web app
   az webapp create --name dropshipping-app --resource-group dropshipping-rg --plan dropshipping-plan
   ```

### 4. Vercel (Frontend Only)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

## Environment Configuration

### Production Environment Variables

#### Backend (.env.production)
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secure-jwt-secret-min-32-characters
DATABASE_URL=postgresql://user:password@host:5432/dropshipping_prod
REDIS_URL=redis://redis:6379
FRONTEND_URL=https://yourdomain.com

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=true
MAIL_USER=your-production-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@yourdomain.com

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

#### Frontend (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Database Migration

### PostgreSQL Setup

1. **Create Database**
   ```sql
   CREATE DATABASE dropshipping_prod;
   CREATE USER dropshipping_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE dropshipping_prod TO dropshipping_user;
   ```

2. **Run Migrations**
   ```bash
   cd backend
   npx typeorm migration:run
   ```

3. **Seed Data (Optional)**
   ```bash
   npm run seed:prod
   ```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

1. **Install Certbot**
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header Host $http_host;
       }
   }
   ```

3. **Obtain SSL Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## Monitoring and Logging

### PM2 Monitoring
```bash
# Monitor applications
pm2 monit

# View logs
pm2 logs
pm2 logs dropshipping-backend
pm2 logs dropshipping-frontend

# Generate startup script
pm2 startup systemd
```

### Application Monitoring
- **Health Checks**: Built-in health check endpoints
- **Performance Monitoring**: PM2 integrated monitoring
- **Error Tracking**: Sentry integration (optional)
- **Database Monitoring**: Query performance tracking

## Backup and Recovery

### Database Backups
```bash
# PostgreSQL backup
gpg_dump -h localhost -U dropshipping_user dropshipping_prod > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/var/backups/dropshipping"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -h localhost -U dropshipping_user dropshipping_prod | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Add to crontab for daily backups
0 2 * * * /path/to/backup/script.sh
```

### File Backups
```bash
# Backup uploads and logs
tar -czf backup_$(date +%Y%m%d).tar.gz backend/uploads backend/logs frontend/public/uploads
```

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to version control
   - Use strong, unique passwords
   - Rotate secrets regularly

2. **Database Security**
   - Use connection pooling
   - Implement database backups
   - Restrict database access by IP

3. **Application Security**
   - Keep dependencies updated
   - Use security headers
   - Implement rate limiting
   - Monitor for vulnerabilities

4. **Network Security**
   - Use HTTPS everywhere
   - Implement firewall rules
   - Use VPN for database access

## Performance Optimization

### Backend Optimization
- Enable gzip compression
- Use Redis for caching
- Implement database query optimization
- Use connection pooling

### Frontend Optimization
- Enable Next.js compression
- Optimize images
- Implement lazy loading
- Use CDN for static assets

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   
   # Check connection
   psql -h localhost -U dropshipping_user -d dropshipping_prod
   ```

2. **Port Conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :3001
   
   # Kill processes if needed
   kill -9 <PID>
   ```

3. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   htop
   
   # Optimize PM2 memory
   pm2 set pm2-logrotate:max_size 10M
   ```

## Support and Maintenance

### Regular Maintenance Tasks
- Update dependencies monthly
- Review security logs weekly
- Monitor performance metrics
- Test backup restoration
- Update SSL certificates

### Emergency Procedures
- Database recovery procedures
- Application rollback procedures
- Incident response plan
- Communication protocols

## Conclusion

This deployment guide provides comprehensive instructions for deploying the Enterprise Dropshipping Management System in production environments. Follow the security best practices and regularly update your deployment to ensure optimal performance and security.

For additional support, refer to the main README.md file or contact the development team.