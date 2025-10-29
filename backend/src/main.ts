import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import detectPort from 'detect-port';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const port = await detectPort(process.env.PORT ? parseInt(process.env.PORT) : 3001);
  console.log(`Server running on port ${port}`);
  await app.listen(port);
}
bootstrap();
