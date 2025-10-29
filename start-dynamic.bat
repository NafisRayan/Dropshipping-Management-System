@echo off
echo.
echo ========================================
echo   Dropshipping Management System
echo   Dynamic Port Detection Enabled
echo ========================================
echo.

echo Installing dependencies if needed...
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

if not exist "backend/node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend/node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Starting services with dynamic port detection...
echo.

node start-dynamic.js

pause