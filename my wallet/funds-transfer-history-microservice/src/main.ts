import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Funds Transfer History API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'API for managing funds transfer history')
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addTag('funds-transfer-history')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);
  
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Funds Transfer History Microservice is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/${process.env.SWAGGER_PATH || 'api'}`);
}
bootstrap(); 