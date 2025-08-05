# Funds Transfer Microservice

A NestJS microservice for handling funds transfers between users with commission validation and admin charges calculation. Features a single comprehensive endpoint that automatically provides commission dropdown data and processes transfers.

## API Endpoints

### POST /funds-transfer/transfer-funds

Single comprehensive endpoint for funds transfer. This endpoint automatically provides all available commission types for dropdown selection and processes the transfer. Supports both JSON and form data requests.

**Two Usage Modes:**

#### 1. **Get Commission Types (Empty POST)**
Send an empty POST request to get all available commission types for dropdown:

```bash
curl -X POST http://localhost:3000/funds-transfer/transfer-funds \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "success": true,
  "message": "Commission types and form data retrieved successfully",
  "data": {
    "commissionTypes": [
      {
        "value": "Referral Comm",
        "label": "Referral Commission",
        "description": "Transfer from Referral Commission"
      },
      {
        "value": "Sponsor Comm",
        "label": "Sponsor Commission",
        "description": "Transfer from Sponsor Commission"
      },
      {
        "value": "AuS Comm",
        "label": "AuS Commission",
        "description": "Transfer from AuS Commission"
      },
      {
        "value": "Product Team Referral Commission",
        "label": "Product Team Referral Commission",
        "description": "Transfer from Product Team Referral Commission"
      },
      {
        "value": "Nova Referral Commission",
        "label": "Nova Referral Commission",
        "description": "Transfer from Nova Referral Commission"
      },
      {
        "value": "Royalty Referral Team Commission",
        "label": "Royalty Referral Team Commission",
        "description": "Transfer from Royalty Referral Team Commission"
      }
    ],
    "formFields": {
      "customerRegisteredId": "",
      "commissionType": "",
      "amount": 0,
      "transactionPassword": ""
    }
  }
}
```

#### 2. **Process Transfer (With Data)**
Send transfer data to process the actual transfer:

**Available Commission Types:**
- `Referral Comm` - Referral Commission
- `Sponsor Comm` - Sponsor Commission  
- `AuS Comm` - AuS Commission
- `Product Team Referral Commission` - Product Team Referral Commission
- `Nova Referral Commission` - Nova Referral Commission
- `Royalty Referral Team Commission` - Royalty Referral Team Commission

**Request Body (JSON):**
```json
{
  "customerRegisteredId": "CUST123456",
  "commissionType": "Referral Comm",
  "amount": 1000.00,
  "transactionPassword": "password123"
}
```

**Request Body (Form Data):**
```
customerRegisteredId: CUST123456
commissionType: Referral Comm
amount: 1000.00
transactionPassword: password123
```

**Process Steps:**
1. **Customer Validation** - Validates the recipient's Customer Registered ID and displays customer name
2. **Commission Selection** - User selects from available commission types dropdown
3. **Balance Validation** - System checks if selected commission has sufficient balance
4. **Admin Charges Calculation** - Calculates 5% admin charges on transfer amount
5. **Net Payable Calculation** - Shows final transfer amount after deducting admin charges
6. **Transaction Password Verification** - Validates user's transaction password
7. **Transfer Processing** - Executes the transfer and updates both sender and receiver wallets

**Success Response (201):**
```json
{
  "success": true,
  "message": "Funds transferred successfully",
  "data": {
    "transactionNo": "TXN20241201001",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "CUST123456",
    "commissionType": "Referral Comm",
    "amount": 1000.00,
    "adminCharges": 50.00,
    "netPayable": 950.00,
    "status": "Success",
    "createdAt": "2024-12-01T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error or insufficient commission balance
- `401 Unauthorized` - Invalid transaction password
- `404 Not Found` - Customer not found
- `500 Internal Server Error` - Server error during transfer

**Validation Rules:**
- `customerRegisteredId` - Required string, must be a valid customer ID
- `commissionType` - Required enum, must be one of the available commission types
- `amount` - Required number, minimum 0.01, must not exceed available commission balance
- `transactionPassword` - Required string, minimum 6 characters, maximum 50 characters

**Example Usage:**

**Get Commission Types (for dropdown):**
```bash
curl -X POST http://localhost:3000/funds-transfer/transfer-funds \
  -H "Content-Type: application/json" \
  -d '{}'
```

**JSON Transfer Request:**
```bash
curl -X POST http://localhost:3000/funds-transfer/transfer-funds \
  -H "Content-Type: application/json" \
  -d '{
    "customerRegisteredId": "CUST123456",
    "commissionType": "Referral Comm",
    "amount": 1000.00,
    "transactionPassword": "password123"
  }'
```

**Form Data Transfer Request:**
```bash
curl -X POST http://localhost:3000/funds-transfer/transfer-funds \
  -F "customerRegisteredId=CUST123456" \
  -F "commissionType=Referral Comm" \
  -F "amount=1000.00" \
  -F "transactionPassword=password123"
```

## Features

- **Single Endpoint** - One comprehensive endpoint for both dropdown data and transfers
- **Auto Dropdown Data** - Automatically provides all commission types for frontend dropdowns
- **Form Data Support** - Accepts both JSON and multipart/form-data requests
- **Form Validation** - Comprehensive validation of all input fields
- **Commission Balance Check** - Validates sufficient balance before transfer
- **Admin Charges** - Automatically calculates 5% admin charges
- **Transaction Password Security** - Validates user's transaction password
- **Real-time Balance Updates** - Updates both sender and receiver wallets
- **Transaction Tracking** - Generates unique transaction numbers and records
- **Error Handling** - Comprehensive error handling with meaningful messages
- **Swagger Documentation** - Complete API documentation with examples

## Dependencies

- `@nestjs/common` - NestJS core functionality
- `@nestjs/mongoose` - MongoDB integration
- `@nestjs/swagger` - API documentation
- `@nestjs/platform-express` - File upload and form data support
- `class-validator` - Input validation
- `class-transformer` - Data transformation
- `axios` - HTTP client for external service calls
- `mongoose` - MongoDB ODM

## Environment Variables

- `USER_SERVICE_URL` - URL for user service (default: http://localhost:3001)
- `USER_TIMEOUT` - Timeout for user service calls (default: 5000ms)
- `WALLET_SERVICE_URL` - URL for wallet service (default: http://localhost:3000)
- `WALLET_TIMEOUT` - Timeout for wallet service calls (default: 5000ms) 