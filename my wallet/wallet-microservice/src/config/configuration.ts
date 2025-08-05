export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet',
  },
  
  api: {
    prefix: process.env.API_PREFIX || 'api',
  },
  
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Wallet Microservice API',
    description: process.env.SWAGGER_DESCRIPTION || 'API documentation for the Wallet Microservice',
    version: process.env.SWAGGER_VERSION || '1.0',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
}); 