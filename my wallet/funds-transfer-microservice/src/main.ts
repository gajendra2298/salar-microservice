import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Swagger configuration using centralized config
  const config = new DocumentBuilder()
    .setTitle(appConfig.swagger.title)
    .setDescription(appConfig.swagger.description)
    .setVersion(appConfig.swagger.version)
    .addTag('funds-transfer')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(appConfig.api.port);
  console.log(`Funds Transfer Microservice is running on port ${appConfig.api.port}`);
  console.log(`Swagger UI is available at http://localhost:${appConfig.api.port}/api`);
  console.log(`Environment: ${appConfig.api.environment}`);
  console.log(`Log Level: ${appConfig.logging.level}`);
}
bootstrap(); 