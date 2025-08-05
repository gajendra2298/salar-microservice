import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import databaseConfig from './database.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3001),
        MONGODB_URI: Joi.string().required(),
        API_PREFIX: Joi.string().default('api'),
        SWAGGER_TITLE: Joi.string().default('Wallet Microservice API'),
        SWAGGER_DESCRIPTION: Joi.string().default('API documentation for the Wallet Microservice'),
        SWAGGER_VERSION: Joi.string().default('1.0'),
        CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
        CORS_CREDENTIALS: Joi.boolean().default(true),
        LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('debug'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class AppConfigModule {} 