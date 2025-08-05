import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS with configuration
  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: configService.get('cors.credentials'),
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(configService.get('swagger.title'))
    .setDescription(configService.get('swagger.description'))
    .setVersion(configService.get('swagger.version'))
    .addTag('wallet')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('api.prefix'), app, document);

  const port = configService.get('port');
  await app.listen(port);
  
  console.log(`Wallet Microservice is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/${configService.get('api.prefix')}`);
  console.log(`Environment: ${configService.get('nodeEnv')}`);
}
bootstrap(); 