import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors();
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Account Microservice API')
    .setDescription(`
      API documentation for the User Account Microservice.
      
      ## Authentication
      All endpoints require JWT Bearer token authentication.
      
      ## OTP System
      - OTPs are 6-digit numeric codes (e.g., 123456)
      - OTPs are sent via email to all users
      - OTPs are sent via SMS only for Indian users
      - OTPs have a limited validity period
      - Each OTP can only be used once
      
      ## Password Requirements
      - Maximum 15 characters
      - Must contain: uppercase, lowercase, number, and special character
      - Special characters allowed: @$!%*?&
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`User Microservice is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api`);
}
bootstrap(); 