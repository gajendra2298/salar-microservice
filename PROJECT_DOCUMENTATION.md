# Mathiox Microservices Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Microservices Overview](#microservices-overview)
4. [Detailed Microservice Documentation](#detailed-microservice-documentation)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [Database Schemas](#database-schemas)
7. [Authentication & Security](#authentication--security)
8. [Setup & Deployment](#setup--deployment)
9. [Development Guidelines](#development-guidelines)

---

## Project Overview

The Mathiox project is a comprehensive microservices-based platform built with NestJS and MongoDB. The system consists of multiple specialized microservices that handle different aspects of the business logic, from user management to financial transactions and team management.

### Key Features
- **Multi-service Architecture**: Independent, scalable microservices
- **Financial Management**: Wallet, funds transfer, and transaction tracking
- **Team Management**: Product and sponsor team hierarchies
- **User Management**: Account management with security features
- **Real-time Processing**: Transaction processing and balance updates
- **Security**: JWT authentication and transaction password protection

---

## System Architecture

### Technology Stack
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator and class-transformer
- **Communication**: RESTful APIs

### Port Configuration
| Microservice | Port | Purpose |
|--------------|------|---------|
| Wallet Microservice | 3001 | Wallet balance management |
| Funds Transfer Microservice | 3002 | Fund transfer operations |
| Funds Transfer History Microservice | 3003 | Transfer history tracking |
| Funds Received Microservice | 3004 | Received funds tracking |
| Credit/Debit Microservice | 3005 | Admin credit/debit operations |
| User Account Microservice | 3006 | User password management |
| Sponsor Team Microservice | 3007 | Sponsor team management |
| Product Team Microservice | 3008 | Product team management |

---

## Microservices Overview

### 1. Wallet Microservice (Port: 3001)
**Purpose**: Central wallet management system for Salar Pay platform

**Core Functions**:
- Wallet balance retrieval and calculation
- Multi-component balance management
- Real-time balance updates
- Available balance computation

**Components Managed**:
- Referral Commission
- Sponsor Commission
- AuS Commission
- Product Team Referral Commission
- Nova Referral Commission
- Royalty Referral Team Commission
- Shopping Amount
- Salar Coins
- Royalty Credits
- Salar Gift Credits
- Funds

### 2. Funds Transfer Microservice (Port: 3002)
**Purpose**: Handles secure fund transfers between users

**Core Functions**:
- Commission-based fund transfers
- Transaction password validation
- Admin charges calculation
- Transaction number generation
- Balance validation
- Real-time wallet updates

**Transfer Types**:
- Referral Commission
- Sponsor Commission
- AuS Commission
- Product Team Referral Commission
- Nova Referral Commission
- Royalty Referral Team Commission
- PRT Commission
- Funds

### 3. Funds Transfer History Microservice (Port: 3003)
**Purpose**: Tracks and manages fund transfer history

**Core Functions**:
- Paginated transfer history
- Date range filtering
- Search functionality
- Status tracking (Success/Failed)
- Transaction details retrieval

### 4. Funds Received Microservice (Port: 3004)
**Purpose**: Manages received funds tracking

**Core Functions**:
- Received funds listing
- Sender information tracking
- Transaction status monitoring
- Pagination and filtering

### 5. Credit/Debit Microservice (Port: 3005)
**Purpose**: Admin credit and debit operations

**Core Functions**:
- Admin credit/debit transactions
- Transaction history management
- Reason tracking
- Balance impact calculation

### 6. User Account Microservice (Port: 3006)
**Purpose**: User password and security management

**Core Functions**:
- Password change with validation
- Transaction password management
- OTP-based security
- Email and SMS integration

### 7. Sponsor Team Microservice (Port: 3007)
**Purpose**: Sponsor team hierarchy management

**Core Functions**:
- Sponsor team member addition
- Team listing with search
- Date-based filtering
- Pagination support

### 8. Product Team Microservice (Port: 3008)
**Purpose**: Product referral team management

**Core Functions**:
- Team level management
- Pending member tracking
- Team tree visualization
- Network count tracking

---

## Detailed Microservice Documentation

### 1. Wallet Microservice

#### Endpoints

**GET /wallet/balance/:userId**
- **Purpose**: Retrieve wallet balance for a user
- **Parameters**: userId (string)
- **Response**: Complete wallet balance with all components
- **Authentication**: Required

**POST /wallet/update-balance**
- **Purpose**: Update wallet balance components
- **Body**: Partial wallet updates
- **Response**: Updated wallet data
- **Authentication**: Required

#### Business Logic
```typescript
// Available balance calculation
const availableBalance = 
  wallet.referralComm +
  wallet.sponsorComm +
  wallet.ausComm +
  wallet.productTeamReferralCommission +
  wallet.novaReferralCommission +
  wallet.royaltyReferralTeamCommission +
  wallet.shoppingAmount +
  wallet.salarCoins +
  wallet.royaltyCredits +
  wallet.salarGiftCredits +
  wallet.funds;
```

### 2. Funds Transfer Microservice

#### Endpoints

**GET /funds-transfer/dropdown-values/:userId**
- **Purpose**: Get available commission types for transfer
- **Parameters**: userId (string)
- **Response**: Available commission types and balances
- **Authentication**: Required

**POST /funds-transfer/transfer**
- **Purpose**: Execute fund transfer
- **Body**: Transfer data (registerId, amount, type, transactionPassword)
- **Response**: Transfer status and transaction details
- **Authentication**: Required

**POST /funds-transfer/transfer-funds**
- **Purpose**: Enhanced fund transfer with form validation
- **Body**: TransferFormDto
- **Response**: Transfer result
- **Authentication**: Required

#### Transfer Process Flow
1. **User Authentication**: Extract user ID from request
2. **Input Validation**: Validate required fields
3. **Sender Validation**: Verify sender user exists
4. **Password Verification**: Validate transaction password
5. **Receiver Validation**: Verify receiver user exists
6. **Self-Transfer Prevention**: Ensure sender ≠ receiver
7. **Commission Validation**: Validate commission type
8. **Balance Check**: Verify sufficient balance
9. **Transaction Creation**: Generate transaction number
10. **Balance Updates**: Update sender and receiver balances
11. **Status Update**: Mark transaction as successful

### 3. Funds Transfer History Microservice

#### Endpoints

**POST /funds-transfer-history/listing**
- **Purpose**: Get paginated transfer history
- **Body**: Listing parameters (userId, page, pagesize, filters)
- **Response**: Transfer history with pagination
- **Authentication**: Required

#### Response Fields
- S.No
- Date
- Receiver Customer Registered ID
- Customer Name
- Funds Transaction No
- Status (Success/Failed)

### 4. Funds Received Microservice

#### Endpoints

**POST /funds-received/listing**
- **Purpose**: Get paginated received funds history
- **Body**: Listing parameters (userId, page, pagesize, filters)
- **Response**: Received funds history with pagination
- **Authentication**: Required

#### Response Fields
- S.No
- Date
- Sender Customer Registered ID
- Sender Customer Name
- Funds Transaction No
- Status (Success/Failed)

### 5. Credit/Debit Microservice

#### Endpoints

**POST /credit-debit/listing**
- **Purpose**: Get paginated credit/debit history
- **Body**: Listing parameters (userId, page, pagesize, filters)
- **Response**: Credit/debit history with pagination
- **Authentication**: Required

**POST /credit-debit/create**
- **Purpose**: Create new credit/debit transaction
- **Body**: Credit/debit data
- **Response**: Transaction creation status
- **Authentication**: Required

#### Transaction Types
- Referral Commission
- Sponsor Commission
- AuS Commission
- Product Team Referral Commission
- Nova Referral Commission
- Royalty Referral Team Commission
- Shopping Amount
- Salar Coins
- Royalty Credits
- Salar Gift Credits
- Funds

### 6. User Account Microservice

#### Endpoints

**POST /user/change-password**
- **Purpose**: Change user's main password
- **Body**: ChangePasswordDto
- **Response**: Password change status
- **Authentication**: Required

**POST /user/change-transaction-password-request**
- **Purpose**: Request OTP for transaction password change
- **Body**: GetOtpDto
- **Response**: OTP request status
- **Authentication**: Required

**POST /user/change-transaction-password**
- **Purpose**: Change transaction password using OTP
- **Body**: ChangeTransactionPasswordDto
- **Response**: Password change status
- **Authentication**: Required

#### Password Requirements
- **Max Length**: 15 characters
- **Must Include**: 
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One number (0-9)
  - One special character (@$!%*?&)

#### OTP System
- **Format**: 6-digit numeric
- **Delivery**: Email (all users) + SMS (Indian users)
- **Validity**: Time-limited
- **Usage**: Single-use only

### 7. Sponsor Team Microservice

#### Endpoints

**POST /sponsor-team/add**
- **Purpose**: Add new sponsor team member
- **Body**: AddSponsorTeamDto
- **Response**: Member addition status
- **Authentication**: Required

**POST /sponsor-team/list**
- **Purpose**: Get sponsor team list with search and filtering
- **Body**: GetSponsorTeamDto
- **Response**: Team list with pagination
- **Authentication**: Required

#### Search Features
- **Search Fields**: user_name, registerId
- **Validation**: Alphanumeric, max 30 characters
- **Date Filtering**: startDate, endDate
- **Pagination**: currentPage, itemsPerPage

### 8. Product Team Microservice

#### Endpoints

**POST /product-team/pending-members**
- **Purpose**: Get pending team members
- **Body**: GetPendingTeamMembersDto
- **Response**: Pending members list
- **Authentication**: Required

**GET /product-team/pending-level-details**
- **Purpose**: Get pending level details
- **Response**: Level details with vacant places
- **Authentication**: Required

**POST /product-team/add-team-member**
- **Purpose**: Add team member to product team
- **Body**: AddTeamMemberDto
- **Response**: Member addition status
- **Authentication**: Required

**GET /product-team/team-tree**
- **Purpose**: Get complete team tree
- **Response**: Team tree with levels and members
- **Authentication**: Required

**GET /product-team/team-tree/:registerId**
- **Purpose**: Get team tree for specific user
- **Parameters**: registerId (string), level (query)
- **Response**: User-specific team tree
- **Authentication**: Required

**GET /product-team/first-level/:registerId**
- **Purpose**: Get first level details for user
- **Parameters**: registerId (string)
- **Response**: First level information
- **Authentication**: Required

**GET /product-team/network-count**
- **Purpose**: Get network team count
- **Response**: Total network count
- **Authentication**: Required

---

## API Endpoints Reference

### Authentication
All endpoints require JWT Bearer token authentication:
```
Authorization: Bearer <your-jwt-token>
```

### Common Response Format
```json
{
  "status": 1,  // 1 for success, 0 for error
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Response Format
```json
{
  "status": 0,
  "message": "Error description"
}
```

### Pagination Format
```json
{
  "status": 1,
  "data": [ /* items */ ],
  "count": 100,
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalPages": 10
  }
}
```

---

## Database Schemas

### Funds Schema
```typescript
{
  userId: ObjectId,           // Sender user ID
  receiverUserId: ObjectId,   // Receiver user ID
  type: String,              // Commission type
  amount: Number,            // Transfer amount
  transactionNo: String,     // Unique transaction number
  status: String,            // 'Pending' | 'Failed' | 'Success'
  adminCharges: Number,      // Admin charges
  netPayable: Number         // Net payable amount
}
```

### Credit/Debit Schema
```typescript
{
  userId: ObjectId,          // User ID
  reason: String,           // Transaction reason
  orderId: String,          // Optional order ID
  status: String,           // 'Credited' | 'Debited'
  type: String,             // Commission type
  amount: Number,           // Transaction amount
  transactionNo: String     // Unique transaction number
}
```

### Wallet Schema
```typescript
{
  userId: ObjectId,                    // User ID
  referralComm: Number,               // Referral commission
  sponsorComm: Number,                // Sponsor commission
  ausComm: Number,                    // AuS commission
  productTeamReferralCommission: Number, // Product team commission
  novaReferralCommission: Number,     // Nova referral commission
  royaltyReferralTeamCommission: Number, // Royalty commission
  shoppingAmount: Number,             // Shopping amount
  salarCoins: Number,                 // Salar coins
  royaltyCredits: Number,             // Royalty credits
  salarGiftCredits: Number,           // Salar gift credits
  funds: Number,                      // Funds
  availableBalance: Number            // Calculated available balance
}
```

### User Schema
```typescript
{
  _id: ObjectId,
  registerId: String,        // Registration ID
  emailId: String,          // Email address
  mobileNo: String,         // Mobile number
  fullName: String,         // Full name
  password: String,         // Hashed password
  transactionPassword: String, // Hashed transaction password
  isDeleted: Boolean,       // Soft delete flag
  status: Boolean,          // Active status
  createdAt: Date,          // Created timestamp
  updatedAt: Date           // Updated timestamp
}
```

### OTP Schema
```typescript
{
  userId: ObjectId,         // User ID
  otp: String,             // OTP code
  type: String,            // OTP type
  isUsed: Boolean,         // Usage status
  expiresAt: Date,         // Expiration time
  createdAt: Date          // Created timestamp
}
```

### Team Levels Schema
```typescript
{
  width: Number,           // Team width
  depth: Number,           // Team depth
  ULDownline: Number,      // Upline/Downline count
  isDeleted: Boolean,      // Soft delete flag
  status: Boolean,         // Active status
  createdAt: Date,         // Created timestamp
  updatedAt: Date          // Updated timestamp
}
```

### Sponsor Team Schema
```typescript
{
  user_id: ObjectId,       // User reference
  sponsor_id: String,      // Sponsor identifier
  doj: String,            // Date of joining
  user_name: String,      // User name
  email_id: String,       // Email address
  registerId: String,     // Registration ID
  sponsor_name: String,   // Sponsor name
  createdAt: Date,        // Created timestamp
  updatedAt: Date         // Updated timestamp
}
```

---

## Authentication & Security

### JWT Authentication
- **Token Format**: Bearer token
- **Header**: `Authorization: Bearer <token>`
- **Validation**: Automatic token validation
- **Expiration**: Configurable token expiration

### Transaction Password Security
- **Purpose**: Additional security for financial transactions
- **Format**: Same as main password requirements
- **Validation**: Required for all fund transfers
- **Reset**: OTP-based reset process

### Password Security
- **Hashing**: bcryptjs for password hashing
- **Requirements**: Complex password requirements
- **Validation**: Real-time password strength validation
- **History**: Password change tracking

### OTP Security
- **Generation**: Cryptographically secure OTP generation
- **Delivery**: Multi-channel delivery (Email + SMS)
- **Validation**: Time-based validation
- **Usage**: Single-use tokens

---

## Setup & Deployment

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Environment Variables

#### Common Variables
```bash
MONGODB_URI=mongodb://localhost:27017/database_name
JWT_SECRET=your-jwt-secret-key
PORT=3001
NODE_ENV=development
```

#### Wallet Microservice
```bash
API_PREFIX=api
SWAGGER_TITLE=Wallet Microservice API
SWAGGER_DESCRIPTION=API documentation for the Wallet Microservice
SWAGGER_VERSION=1.0
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
LOG_LEVEL=debug
```

#### User Account Microservice
```bash
SEND_GRID_TOKEN=your-sendgrid-api-key
SMS_USER=your-sms-username
SMS_PASSWORD=your-sms-password
SMS_SENDER=your-sms-sender-id
SMS_TRANS_PASSWORD_OTP_TEMPLATEID=your-sms-template-id
```

### Installation Steps

1. **Clone and Install Dependencies**
```bash
# For each microservice
cd microservice-directory
npm install
```

2. **Environment Setup**
```bash
# Copy environment examples
cp env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
# Ensure MongoDB is running
mongod --dbpath /path/to/data/db
```

4. **Start Microservices**
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

---

## Development Guidelines

### Code Structure
```
src/
├── auth/                 # Authentication modules
│   ├── guards/          # JWT guards
│   ├── strategies/      # Passport strategies
│   └── middleware/      # Custom middleware
├── config/              # Configuration files
├── dto/                 # Data Transfer Objects
├── schemas/             # MongoDB schemas
├── services/            # Business logic
├── controllers/         # API endpoints
└── main.ts             # Application entry point
```

### Best Practices

#### 1. Error Handling
```typescript
try {
  // Business logic
} catch (error) {
  console.error('Error:', error);
  return {
    status: 0,
    message: 'Operation failed'
  };
}
```

#### 2. Validation
```typescript
// Use DTOs with class-validator
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;
}
```

#### 3. Response Format
```typescript
// Consistent response format
return {
  status: 1,
  message: 'Operation successful',
  data: result
};
```

#### 4. Logging
```typescript
// Use structured logging
console.log('Operation:', {
  userId,
  action: 'fund_transfer',
  amount,
  timestamp: new Date()
});
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### API Documentation
- **Swagger UI**: Available at `/api` endpoint
- **OpenAPI**: Auto-generated from decorators
- **Examples**: Included in documentation

### Monitoring
- **Health Checks**: Implement health check endpoints
- **Logging**: Structured logging for debugging
- **Metrics**: Performance monitoring
- **Error Tracking**: Error reporting and alerting

---

## Summary

The Mathiox microservices project is a comprehensive financial and team management platform with the following key characteristics:

### Architecture Highlights
- **Microservices**: 8 independent, scalable services
- **Financial Management**: Complete wallet and transaction system
- **Team Management**: Hierarchical team structures
- **Security**: Multi-layer authentication and authorization
- **Real-time Processing**: Immediate balance updates and transaction processing

### Key Features
1. **Wallet Management**: Multi-component balance tracking
2. **Fund Transfers**: Secure commission-based transfers
3. **Team Hierarchies**: Product and sponsor team management
4. **User Security**: Password and OTP-based security
5. **Transaction Tracking**: Complete audit trail
6. **Real-time Updates**: Immediate balance and status updates

### Technology Stack
- **Backend**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator and class-transformer

### Scalability Features
- **Independent Services**: Each microservice can scale independently
- **Database Isolation**: Separate databases per service
- **Load Balancing**: Support for horizontal scaling
- **Caching**: Redis integration ready
- **Message Queues**: Event-driven architecture support

This documentation provides a complete overview of the system architecture, API endpoints, business processes, and development guidelines for the Mathiox microservices project. 