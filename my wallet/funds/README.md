# Funds Microservice

A NestJS microservice for managing fund transfers and transactions in the wallet system.

## Features

- **Fund Transfer**: Transfer funds between users with proper validations
- **Transaction History**: View sent and received fund history with pagination
- **User Details**: Get user commission and fund details
- **Transaction Details**: Retrieve specific transaction information
- **Mock User System**: Built-in mock user data for testing and demonstration
- **Comprehensive Validation**: Input validation and business logic validation
- **Swagger Documentation**: Complete API documentation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. Navigate to the funds microservice directory:
```bash
cd "my wallet/funds"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
npm run setup
```

4. Edit the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/funds
PORT=3002
NODE_ENV=development
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

### Testing
```bash
npm run test
npm run test:watch
npm run test:cov
```

## API Endpoints

### Base URL
```
http://localhost:3002/api
```

### Swagger Documentation
```
http://localhost:3002/api/docs
```

### Available Endpoints

#### 1. Get Dropdown Values for Funds
- **POST** `/funds/dropdown-values`
- **Description**: Retrieve user commission and fund details for dropdown display
- **Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```
- **Response**: User details with commission balances

#### 2. Transfer Funds
- **POST** `/funds/transfer`
- **Description**: Transfer funds from one user to another
- **Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "registerId": "USER002",
  "amount": 100,
  "type": "Sponser Commission",
  "transactionPassword": "password123"
}
```

#### 3. Get Transfer History
- **POST** `/funds/transfer-history`
- **Description**: Retrieve paginated list of funds sent by the user
- **Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "page": 1,
  "pagesize": 10,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "searchText": "transaction"
}
```

#### 4. Get Received History
- **POST** `/funds/received-history`
- **Description**: Retrieve paginated list of funds received by the user
- **Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "page": 1,
  "pagesize": 10,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "searchText": "transaction"
}
```

#### 5. Get Transaction Details
- **GET** `/funds/transaction/{transactionNo}`
- **Description**: Retrieve details of a specific transaction
- **Parameters**: `transactionNo` - Transaction number

#### 6. Get All Fund Records
- **POST** `/funds/all-records`
- **Description**: Retrieve all fund records (both sent and received) for a user
- **Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

#### 7. Get Fund Statistics
- **POST** `/funds/statistics`
- **Description**: Retrieve comprehensive fund statistics for a user
- **Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```
- **Response**: Includes total sent/received amounts, transaction counts, and net amount

## Mock Users

The service includes mock user data for testing:

### User 1
- **User ID**: `507f1f77bcf86cd799439011`
- **Register ID**: `USER001`
- **Name**: John Doe
- **Transaction Password**: `password123`
- **Balances**:
  - Sponser Commission: 1000
  - Aur Commission: 500
  - Game Commission: 750
  - Funds: 2000
  - PRT Commission: 300

### User 2
- **User ID**: `507f1f77bcf86cd799439012`
- **Register ID**: `USER002`
- **Name**: Jane Smith
- **Transaction Password**: `password456`
- **Balances**:
  - Sponser Commission: 800
  - Aur Commission: 400
  - Game Commission: 600
  - Funds: 1500
  - PRT Commission: 200

## Fund Types

The microservice supports the following fund types:
- `Sponser Commission`
- `Aur Commission`
- `Game Commission`
- `Funds`
- `PRT Commission`

## Transaction Status

Transactions can have the following statuses:
- `Pending`
- `Failed`
- `Success`

## Validation Rules

### User Details
- `userId`: Required, valid user ID string

### Fund Transfer
- `userId`: Required, valid user ID string
- `registerId`: Required, max 50 characters
- `amount`: Required, minimum 1
- `type`: Required, must be one of the valid fund types
- `transactionPassword`: Required, non-empty string

### History Listing
- `userId`: Required, valid user ID string
- `page`: Optional, minimum 1, default 1
- `pagesize`: Optional, 1-100, default 10
- `startDate`: Optional, valid date format (YYYY-MM-DD)
- `endDate`: Optional, valid date format (YYYY-MM-DD)
- `searchText`: Optional, string for searching

## Database Schema

```typescript
{
  userId: ObjectId,           // Reference to users collection
  receiverUserId: ObjectId,   // Reference to users collection
  type: String,              // Enum: Fund types
  amount: Number,            // Transfer amount
  transactionNo: String,     // Unique transaction number
  status: String,           // Enum: Pending, Failed, Success
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

## Error Handling

The microservice includes comprehensive error handling:
- Input validation errors
- Business logic validation errors
- Database errors
- Internal server errors

All errors return a consistent format:
```json
{
  "status": 0,
  "message": "Error description"
}
```

## Security Features

- Input validation using class-validator
- Business logic validation
- Transaction password verification
- CORS configuration
- Request/response validation

## Development Notes

- **Standalone Service**: This is a standalone microservice with mock user data
- **Mock Implementation**: User operations use built-in mock data for demonstration
- **Transaction Security**: All transactions require valid transaction password verification
- **Error Handling**: Comprehensive error handling for all scenarios
- **Testing**: Ready for integration with real user services

## Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include comprehensive tests
4. Update Swagger documentation
5. Follow NestJS best practices

## License

This project is part of the wallet microservices system. 