import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Credit/Debit Microservice API')
    .setDescription('API documentation for Credit/Debit Microservice')
    .setVersion('1.0')
    .addTag('credit-debit')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3005);
  console.log('Credit/Debit Microservice is running on port 3005');
  console.log('Swagger UI is available at http://localhost:3005/api');
}
bootstrap(); 