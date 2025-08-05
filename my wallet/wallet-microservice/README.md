# Wallet Microservice

A NestJS microservice for managing wallet balances and components with Swagger UI documentation.

## Features

- ✅ Wallet balance management
- ✅ Swagger UI API documentation
- ✅ Environment configuration
- ✅ MongoDB integration
- ✅ Input validation
- ✅ CORS support

## Environment Configuration

### 1. Copy the example environment file

```bash
cp env.example .env
```

### 2. Configure your environment variables

Edit the `.env` file with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/wallet

# Server Configuration
PORT=3001
NODE_ENV=development

# API Configuration
API_PREFIX=api
SWAGGER_TITLE=Wallet Microservice API
SWAGGER_DESCRIPTION=API documentation for the Wallet Microservice
SWAGGER_VERSION=1.0

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Logging Configuration
LOG_LEVEL=debug
```

### 3. Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/wallet` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment (development/production/test) | `development` |
| `API_PREFIX` | Swagger UI endpoint prefix | `api` |
| `SWAGGER_TITLE` | API documentation title | `Wallet Microservice API` |
| `SWAGGER_DESCRIPTION` | API documentation description | `API documentation for the Wallet Microservice` |
| `SWAGGER_VERSION` | API version | `1.0` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `CORS_CREDENTIALS` | Allow CORS credentials | `true` |
| `LOG_LEVEL` | Logging level | `debug` |

## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger UI at:

```
http://localhost:3001/api
```

## API Endpoints

### GET /wallet/balance/:userId
Get wallet balance for a specific user.

**Parameters:**
- `userId` (string): MongoDB ObjectId of the user

**Response:**
```json
{
  "status": 1,
  "message": "Wallet balance retrieved successfully",
  "data": {
    "referralComm": 100.50,
    "sponsorComm": 50.25,
    "ausComm": 75.00,
    "productTeamReferralCommission": 25.00,
    "novaReferralCommission": 30.00,
    "royaltyReferralTeamCommission": 40.00,
    "shoppingAmount": 200.00,
    "salarCoins": 150.00,
    "royaltyCredits": 80.00,
    "salarGiftCredits": 60.00,
    "funds": 500.00,
    "availableBalance": 1311.75
  }
}
```

### POST /wallet/update-balance
Update wallet balance components for a user.

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "referralComm": 100.50,
  "sponsorComm": 50.25,
  "ausComm": 75.00,
  "productTeamReferralCommission": 25.00,
  "novaReferralCommission": 30.00,
  "royaltyReferralTeamCommission": 40.00,
  "shoppingAmount": 200.00,
  "salarCoins": 150.00,
  "royaltyCredits": 80.00,
  "salarGiftCredits": 60.00,
  "funds": 500.00
}
```

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
LOG_LEVEL=info
MONGODB_URI=mongodb://your-production-db:27017/wallet
```

### Testing
```env
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/wallet-test
```

## Validation

The application includes automatic validation for:
- Environment variables (using Joi)
- Request DTOs (using class-validator)
- MongoDB ObjectId validation

## Error Handling

The application provides comprehensive error handling with:
- Input validation errors
- Database connection errors
- Business logic errors
- Proper HTTP status codes

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
``` 