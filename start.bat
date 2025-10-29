@echo off
echo Starting Dropshipping Management System...
echo.
echo Starting Backend (NestJS)...
start "Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend (Next.js)...
start "Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Both services are starting...
echo Backend will be available at: http://localhost:3001
echo Frontend will be available at: http://localhost:3000
echo API Documentation: http://localhost:3001/api
echo.
pause