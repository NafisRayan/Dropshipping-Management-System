import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as net from 'net';

async function findAvailablePort(startPort: number = 3001): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Find available port
  const port = await findAvailablePort(3001);
  
  // Enable CORS for multiple possible frontend ports
  const allowedOrigins = [];
  for (let i = 3000; i <= 3010; i++) {
    allowedOrigins.push(`http://localhost:${i}`);
  }
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Dropshipping Management API')
    .setDescription('API for dropshipping management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Write port to a file so frontend can read it
  const fs = require('fs');
  const path = require('path');
  const portFile = path.join(__dirname, '../../backend-port.json');
  fs.writeFileSync(portFile, JSON.stringify({ port, apiUrl: `http://localhost:${port}` }));
}
bootstrap();