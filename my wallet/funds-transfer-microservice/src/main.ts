import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Enable validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Funds Transfer Microservice')
    .setDescription('API for handling funds transfers with commission validation')
    .setVersion('1.0')
    .addTag('funds-transfer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = appConfig.api.port;
  await app.listen(port);
  console.log(`Funds Transfer Microservice is running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api`);
  }
  
  bootstrap(); 