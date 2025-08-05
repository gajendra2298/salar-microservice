# Funds Transfer Microservice

A NestJS microservice for handling fund transfers between users with external service integration using axios.

## Features

- ✅ Swagger UI API Documentation
- ✅ MongoDB Integration with Mongoose
- ✅ External Service Integration using Axios
- ✅ Comprehensive Error Handling
- ✅ Transaction Password Validation
- ✅ Balance Validation
- ✅ User Validation

## API Endpoints

### 1. GET /funds-transfer/dropdown-values/:userId
Fetches user details from external user service for dropdown values.

**Parameters:**
- `userId` (string): User ID to fetch details for

**Responses:**
- `200`: User details retrieved successfully
- `401`: Unauthorized access to user service
- `404`: User not found
- `503`: User service unavailable
- `408`: Request timeout

### 2. POST /funds-transfer/transfer
Transfers funds between accounts with comprehensive validation.

**Request Body:**
```json
{
  "userId": "string",
  "registerId": "string", 
  "amount": "number",
  "type": "string",
  "transactionPassword": "string"
}
```

**Responses:**
- `201`: Funds transferred successfully
- `400`: Bad request (invalid data, insufficient balance, same user)
- `401`: Invalid transaction password
- `404`: Receiver user not found
- `503`: External services unavailable
- `500`: Internal server error

## External Services Integration

The microservice integrates with the following external services:

### 1. User Service (Port 3001)
- **GET** `/api/users/{userId}/details` - Fetch user details
- **GET** `/api/users/{userId}` - Validate user exists

### 2. Authentication Service (Port 3003)
- **POST** `/api/auth/validate-password` - Validate transaction password

### 3. Balance Service (Port 3004)
- **GET** `/api/balance/{userId}/{type}` - Fetch user balance
- **POST** `/api/balance/transfer` - Update balances after transfer

## Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/funds-transfer

# External Service URLs
USER_SERVICE_URL=http://localhost:3001
AUTH_SERVICE_URL=http://localhost:3003
BALANCE_SERVICE_URL=http://localhost:3004

# API Authentication
API_TOKEN=your-api-token-here

# Application Configuration
PORT=3002
NODE_ENV=development
```

## Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   ```

3. **Start the application:**
   ```bash
   npm run start:dev
   ```

4. **Access Swagger UI:**
   ```
   http://localhost:3002/api
   ```

## Error Handling

The service includes comprehensive error handling for:

- **Network Errors**: Connection refused, timeouts
- **HTTP Status Errors**: 401, 404, 503, etc.
- **Validation Errors**: Missing fields, invalid data
- **Business Logic Errors**: Insufficient balance, same user transfer

## API Documentation

Swagger UI provides interactive documentation at `/api` endpoint with:
- Detailed request/response schemas
- Example requests
- Response codes and descriptions
- Try-it-out functionality

## Dependencies

- `@nestjs/common`: NestJS core
- `@nestjs/mongoose`: MongoDB integration
- `@nestjs/swagger`: API documentation
- `axios`: HTTP client for external services
- `mongoose`: MongoDB ODM
- `swagger-ui-express`: Swagger UI 