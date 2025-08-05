# Wallet Microservices

This directory contains all the microservices for the wallet functionality, built with NestJS and MongoDB.

## Microservices Overview

### 1. Wallet Microservice (Port: 3001)
**Purpose**: Manages wallet balance and components (Salar Pay)

**Features**:
- Get wallet balance with all components
- Update wallet balance
- Calculate available balance automatically

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

**API Endpoints**:
- `GET /wallet/balance/:userId` - Get wallet balance
- `POST /wallet/update-balance` - Update wallet balance

### 2. Funds Transfer Microservice (Port: 3002)
**Purpose**: Handles fund transfers between users

**Features**:
- Get dropdown values for available funds
- Transfer funds to other users
- Validate transaction password
- Calculate admin charges
- Generate transaction numbers

**API Endpoints**:
- `GET /funds-transfer/dropdown-values/:userId` - Get available funds
- `POST /funds-transfer/transfer` - Transfer funds

**Transfer Types**:
- Referral Comm
- Sponsor Comm
- AuS Comm
- Product Team Referral Commission
- Nova Referral Commission
- Royalty Referral Team Commission
- Funds

### 3. Funds Transfer History Microservice (Port: 3003)
**Purpose**: Lists customer commission transfers to other customers

**Features**:
- Paginated listing of transfer history
- Date range filtering
- Search functionality
- Sort options

**API Endpoints**:
- `POST /funds-transfer-history/listing` - Get transfer history

**Response Fields**:
- S.No
- Date
- Receiver Customer Registered ID
- Customer Name
- Funds Transaction No
- Status (Success/Failed)

### 4. Funds Received Microservice (Port: 3004)
**Purpose**: Lists customer commission received from other customers

**Features**:
- Paginated listing of received funds
- Date range filtering
- Search functionality
- Sort options

**API Endpoints**:
- `POST /funds-received/listing` - Get received funds history

**Response Fields**:
- S.No
- Date
- Sender Customer Registered ID
- Sender Customer Name
- Funds Transaction No
- Status (Success/Failed)

### 5. Credit/Debit Microservice (Port: 3005)
**Purpose**: Manages admin credit or debit transactions

**Features**:
- Paginated listing of credit/debit transactions
- Date range filtering
- Search functionality
- Create new credit/debit transactions

**API Endpoints**:
- `POST /credit-debit/listing` - Get credit/debit history
- `POST /credit-debit/create` - Create new transaction

**Response Fields**:
- S.No
- Date
- Transaction No
- Type (Credited/Debited)
- Amount
- Status (Success/Failed)
- Reason

**Credit/Debit Reasons**:
- Referral Comm
- Sponsor Comm
- AuS Comm
- Product Team Referral Commission
- Nova Referral Commission
- Royalty Referral Team Commission
- Shopping Amount
- Salar Coins
- Royalty Credits
- Salar Gift Credits
- Funds

## Database Schemas

### Funds Schema
```typescript
{
  userId: ObjectId,
  receiverUserId: ObjectId,
  type: String (enum),
  amount: Number,
  transactionNo: String,
  status: String (enum: ['Pending', 'Failed', 'Success']),
  adminCharges: Number,
  netPayable: Number
}
```

### Credit/Debit Schema
```typescript
{
  userId: ObjectId,
  reason: String,
  orderId: String,
  status: String (enum: ['Credited', 'Debited']),
  type: String (enum),
  amount: Number,
  transactionNo: String
}
```

### Wallet Schema
```typescript
{
  userId: ObjectId,
  referralComm: Number,
  sponsorComm: Number,
  ausComm: Number,
  productTeamReferralCommission: Number,
  novaReferralCommission: Number,
  royaltyReferralTeamCommission: Number,
  shoppingAmount: Number,
  salarCoins: Number,
  royaltyCredits: Number,
  salarGiftCredits: Number,
  funds: Number,
  availableBalance: Number
}
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Install dependencies for each microservice**:
```bash
cd wallet-microservice && npm install
cd ../funds-transfer-microservice && npm install
cd ../funds-transfer-history-microservice && npm install
cd ../funds-received-microservice && npm install
cd ../credit-debit-microservice && npm install
```

2. **Set up environment variables**:
Create `.env` files in each microservice directory with:
```
MONGODB_URI=mongodb://localhost:27017/your_database_name
```

3. **Start the microservices**:
```bash
# Terminal 1
cd wallet-microservice && npm run start:dev

# Terminal 2
cd funds-transfer-microservice && npm run start:dev

# Terminal 3
cd funds-transfer-history-microservice && npm run start:dev

# Terminal 4
cd funds-received-microservice && npm run start:dev

# Terminal 5
cd credit-debit-microservice && npm run start:dev
```

## API Usage Examples

### Get Wallet Balance
```bash
curl -X GET http://localhost:3001/wallet/balance/user123
```

### Transfer Funds
```bash
curl -X POST http://localhost:3002/funds-transfer/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "registerId": "RECEIVER123",
    "amount": 1000,
    "type": "Sponsor Comm",
    "transactionPassword": "password123"
  }'
```

### Get Transfer History
```bash
curl -X POST http://localhost:3003/funds-transfer-history/listing \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "page": 1,
    "pagesize": 10,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### Get Received Funds
```bash
curl -X POST http://localhost:3004/funds-received/listing \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "page": 1,
    "pagesize": 10
  }'
```

### Get Credit/Debit History
```bash
curl -X POST http://localhost:3005/credit-debit/listing \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "page": 1,
    "pagesize": 10
  }'
```

## Architecture Notes

- Each microservice is independent and can be deployed separately
- All microservices use MongoDB for data persistence
- RESTful API design with consistent response formats
- Error handling and validation included
- Pagination support for listing endpoints
- Search and filtering capabilities
- Transaction number generation for tracking

## Security Considerations

- Transaction password validation for fund transfers
- User authentication should be implemented
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure communication between microservices

## Monitoring and Logging

- Each microservice logs operations and errors
- Transaction tracking with unique IDs
- Performance monitoring recommended
- Database connection monitoring
- API response time tracking 