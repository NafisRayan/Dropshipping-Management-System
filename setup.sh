#!/bin/bash

# Enterprise Dropshipping Management System Setup Script

echo "🚀 Setting up Enterprise Dropshipping Management System..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Create environment files
echo "📝 Creating environment files..."

# Backend environment file
if [ ! -f backend/.env ]; then
    cat > backend/.env << EOL
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_PATH=database.sqlite
FRONTEND_URL=http://localhost:3001
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@dropshipping.com
APP_URL=http://localhost:3000
EOL
    echo "✅ Backend .env file created"
else
    echo "⚠️  Backend .env file already exists"
fi

# Frontend environment file
if [ ! -f frontend/.env.local ]; then
    cat > frontend/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:3000
EOL
    echo "✅ Frontend .env.local file created"
else
    echo "⚠️  Frontend .env.local file already exists"
fi

# Make the script executable
chmod +x setup.sh

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Update the environment variables in backend/.env"
echo "2. Run 'npm run dev' to start the development servers"
echo "3. Access the application at http://localhost:3001"
echo "4. Register your first admin user"
echo ""
echo "📖 For more information, check the README.md file"
echo "=================================================="