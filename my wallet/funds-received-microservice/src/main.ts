import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Funds Received Microservice')
    .setDescription('API documentation for the Funds Received Microservice')
    .setVersion('1.0')
    .addTag('Funds Received', 'Endpoints for managing funds received data')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Funds Received API Documentation',
  });

  await app.listen(3004);
  console.log('Funds Received Microservice is running on port 3004');
  console.log('Swagger UI is available at: http://localhost:3004/api');
}
bootstrap(); 