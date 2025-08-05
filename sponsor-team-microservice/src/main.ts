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
    .setTitle('Sponsor Team Microservice API')
    .setDescription('API documentation for the Sponsor Team Microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Sponsor Team Microservice is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api`);
}
bootstrap(); 