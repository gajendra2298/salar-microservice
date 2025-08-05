export interface AppConfig {
  // MongoDB Configuration
  mongodb: {
    uri: string;
  };
  
  // External Services
  services: {
    user: {
      url: string;
      timeout: number;
    };
    auth: {
      url: string;
      timeout: number;
    };
    balance: {
      url: string;
      timeout: number;
    };
  };
  
  // API Configuration
  api: {
    token: string;
    port: number;
    environment: string;
  };
  
  // Swagger Configuration
  swagger: {
    title: string;
    description: string;
    version: string;
  };
  
  // Logging
  logging: {
    level: string;
  };
}

export const appConfig: AppConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-transfer',
  },
  
  services: {
    user: {
      url: process.env.USER_SERVICE_URL || 'http://localhost:3001',
      timeout: parseInt(process.env.REQUEST_TIMEOUT || '10000'),
    },
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3003',
      timeout: parseInt(process.env.AUTH_TIMEOUT || '5000'),
    },
    balance: {
      url: process.env.BALANCE_SERVICE_URL || 'http://localhost:3004',
      timeout: parseInt(process.env.BALANCE_TIMEOUT || '5000'),
    },
  },
  
  api: {
    token: process.env.API_TOKEN || '',
    port: parseInt(process.env.PORT || '3002'),
    environment: process.env.NODE_ENV || 'development',
  },
  
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Funds Transfer Microservice',
    description: process.env.SWAGGER_DESCRIPTION || 'API for handling fund transfers between users',
    version: process.env.SWAGGER_VERSION || '1.0',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
}; 