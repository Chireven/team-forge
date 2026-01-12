/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './app/filters/all-exceptions.filter';
import { TransformInterceptor } from './app/interceptors/transform.interceptor';

async function bootstrap() {
  // Buffer logs until Pino is ready
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino for all logging
  app.useLogger(app.get(Logger));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Global Validation Pipe (Rule 10)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Internal/Private properties stripped
    forbidNonWhitelisted: true, // Throw error if unknown properties sent
    transform: true, // Auto-convert types
  }));

  // Global Exception Filter (Rule 23)
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, app.get(Logger)));

  // Global Response Interceptor (Rule 23)
  app.useGlobalInterceptors(new TransformInterceptor());

  // app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
