const { spawn } = require('child_process');
const net = require('net');
const fs = require('fs');
const path = require('path');

// Function to find available port
function findAvailablePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function startServices() {
  console.log('🚀 Starting Dropshipping Management System...\n');
  
  try {
    // Find available ports
    const backendPort = await findAvailablePort(3001);
    const frontendPort = await findAvailablePort(backendPort + 1); // Ensure different ports
    
    console.log(`📡 Backend will start on port: ${backendPort}`);
    console.log(`🌐 Frontend will start on port: ${frontendPort}\n`);
    
    // Create environment files with dynamic ports
    const backendEnv = `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=${backendPort}`;
    
    const frontendEnv = `NEXT_PUBLIC_API_URL=http://localhost:${backendPort}
PORT=${frontendPort}`;
    
    fs.writeFileSync(path.join(__dirname, 'backend/.env'), backendEnv);
    fs.writeFileSync(path.join(__dirname, 'frontend/.env.local'), frontendEnv);
    
    console.log('📝 Environment files updated with dynamic ports\n');
    
    // Start backend
    console.log('🔧 Starting backend...');
    const backend = spawn('npm', ['run', 'start:dev'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'pipe',
      shell: true
    });
    
    backend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Backend running')) {
        console.log('✅ Backend started successfully');
        startFrontend();
      }
      console.log(`[Backend] ${output.trim()}`);
    });
    
    backend.stderr.on('data', (data) => {
      console.error(`[Backend Error] ${data.toString().trim()}`);
    });
    
    // Start frontend after backend is ready
    function startFrontend() {
      setTimeout(() => {
        console.log('\n🎨 Starting frontend...');
        const frontend = spawn('npm', ['run', 'dev'], {
          cwd: path.join(__dirname, 'frontend'),
          stdio: 'pipe',
          shell: true,
          env: { ...process.env, PORT: frontendPort.toString() }
        });
        
        frontend.stdout.on('data', (data) => {
          const output = data.toString();
          if (output.includes('Ready')) {
            console.log('✅ Frontend started successfully');
            console.log('\n🎉 System is ready!');
            console.log(`🌐 Frontend: http://localhost:${frontendPort}`);
            console.log(`📡 Backend: http://localhost:${backendPort}`);
            console.log(`📚 API Docs: http://localhost:${backendPort}/api`);
          }
          console.log(`[Frontend] ${output.trim()}`);
        });
        
        frontend.stderr.on('data', (data) => {
          console.error(`[Frontend Error] ${data.toString().trim()}`);
        });
      }, 3000);
    }
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down services...');
      backend.kill();
      if (typeof frontend !== 'undefined') {
        frontend.kill();
      }
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting services:', error);
    process.exit(1);
  }
}

startServices();