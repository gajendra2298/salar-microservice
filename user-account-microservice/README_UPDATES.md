# User Account Microservice Updates

## Changes Made

### 1. Removed JWT Authentication
- Removed all JWT-related imports and guards from controllers
- Removed `AuthModule` and `AuthMiddleware` from the application
- Updated existing endpoints to work without JWT authentication
- Added `userId` field to DTOs to identify users instead of using JWT tokens

### 2. Added New Endpoints

#### Add User Endpoint
- **Route**: `POST /user/add`
- **Controller**: `AddUserController` (separate file)
- **DTO**: `AddUserDto`
- **Description**: Creates a new user with all required information
- **Features**:
  - Validates password and transaction password format
  - Encrypts passwords using bcrypt
  - Generates unique register ID
  - Checks for existing users with same email
  - Sets default values for wallet, commissions, etc.

#### Get User by ID Endpoint
- **Route**: `GET /user/:id`
- **Controller**: `GetUserController` (separate file)
- **Description**: Retrieves user information by user ID
- **Features**:
  - Excludes sensitive data (password, transaction password, OTP)
  - Returns user details safely
  - Handles non-existent users with 404 response

#### Update User by ID Endpoint
- **Route**: `PUT /user/:id`
- **Controller**: `UpdateUserController` (separate file)
- **DTO**: `UpdateUserDto`
- **Description**: Updates any field or multiple fields of a user by ID
- **Features**:
  - Only updates fields provided in the request body
  - Validates and encrypts passwords if provided
  - Checks for email uniqueness when updating email
  - Returns updated user data (excluding sensitive information)
  - Supports partial updates (single field or multiple fields)

### 3. Updated Existing Endpoints

#### Password Management Endpoints
- **Route**: `POST /user/change-password`
- **Route**: `POST /user/change-transaction-password-request`
- **Route**: `POST /user/change-transaction-password`
- **Changes**:
  - Removed JWT authentication
  - Added `userId` field to DTOs
  - Updated to work without authentication middleware

### 4. File Structure

```
src/user/
├── controllers/
│   ├── user.controller.ts          # Password management endpoints
│   ├── add-user.controller.ts      # Add user endpoint (NEW)
│   ├── get-user.controller.ts      # Get user endpoint (NEW)
│   └── update-user.controller.ts   # Update user endpoint (NEW)
├── dto/
│   ├── add-user.dto.ts            # Add user DTO (NEW)
│   ├── get-user.dto.ts            # Get user DTO (NEW)
│   ├── update-user.dto.ts         # Update user DTO (NEW)
│   ├── change-password.dto.ts     # Updated with userId
│   └── change-transaction-password.dto.ts # Updated with userId
├── services/
│   └── user.service.ts            # Updated with new methods
└── user.module.ts                 # Updated to include new controllers
```

### 5. New Service Methods

#### `addUser(addUserDto: AddUserDto)`
- Validates user data
- Checks for existing users
- Encrypts passwords
- Creates new user with default values
- Returns user creation response

#### `getUserById(userId: string)`
- Retrieves user by ID
- Excludes sensitive data
- Returns user information safely

#### `updateUser(userId: string, updateUserDto: UpdateUserDto)`
- Updates user by ID with any combination of fields
- Validates and encrypts passwords if provided
- Checks email uniqueness when updating email
- Returns updated user data safely

### 6. Testing

New test file: `test/user-management.test.ts`
- Tests for add user endpoint
- Tests for get user by ID endpoint
- Tests for update user endpoint
- Validates error responses
- Tests password validation
- Tests partial updates
- Tests email uniqueness validation

### 7. API Documentation

All endpoints are documented with Swagger annotations:
- Clear descriptions
- Example values
- Response codes
- Parameter validation

## Usage Examples

### Add User
```bash
POST /user/add
{
  "fullName": "John Doe",
  "emailId": "john.doe@example.com",
  "mobileNo": "+919876543210",
  "password": "Password123!",
  "transactionPassword": "Transaction123!",
  "role": "regular",
  "dob": "1990-01-01",
  "gender": "male",
  "image": "profile.jpg",
  "imageUrl": "https://example.com/profile.jpg",
  "countryId": "507f1f77bcf86cd799439011",
  "sponserId": "507f1f77bcf86cd799439012",
  "ulDownlineId": "507f1f77bcf86cd799439013",
  "level": 1,
  "organisationId": "507f1f77bcf86cd799439014",
  "bankDetails": "507f1f77bcf86cd799439015",
  "kycDetails": "507f1f77bcf86cd799439016",
  "stateId": "507f1f77bcf86cd799439017",
  "districtId": "507f1f77bcf86cd799439018",
  "city": "New York",
  "zipCode": "12345",
  "userAddedBy": "507f1f77bcf86cd799439019",
  "termsAndConditions": true,
  "isDeleted": false,
  "status": true,
  "salesStatus": false,
  "orderProcessingStatus": false,
  "preferredLanguage": "en",
  "wallet": 0,
  "freezingAmount": 0,
  "salarCoins": 0,
  "shoppingAmount": 0,
  "sponserCommission": 0,
  "aurCommission": 0,
  "gameCommission": 0,
  "funds": 0,
  "shippingAddresses": [
    {
      "name": "Home Address",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "New York",
      "cityId": "507f1f77bcf86cd799439020",
      "stateId": "507f1f77bcf86cd799439017",
      "districtId": "507f1f77bcf86cd799439018",
      "zipCode": 12345,
      "mobileNo": "+919876543210",
      "emailId": "john.doe@example.com",
      "countryId": "507f1f77bcf86cd799439011",
      "landmark": "Near Central Park",
      "defaultAddress": true
    }
  ]
}
```

### Get User by ID
```bash
GET /user/507f1f77bcf86cd799439011
```

### Update User by ID
```bash
# Update single field
PUT /user/507f1f77bcf86cd799439011
{
  "fullName": "Updated John Doe"
}

# Update multiple fields
PUT /user/507f1f77bcf86cd799439011
{
  "fullName": "Updated John Doe",
  "city": "New York",
  "wallet": 100,
  "funds": 200,
  "preferredLanguage": "es"
}

# Update password (will be encrypted)
PUT /user/507f1f77bcf86cd799439011
{
  "password": "NewPassword123!"
}
```

### Change Password
```bash
POST /user/change-password
{
  "userId": "507f1f77bcf86cd799439011",
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!",
  "transactionPassword": "TransPass123!"
}
```

## Security Notes

- Passwords are encrypted using bcrypt
- Sensitive data is excluded from GET responses
- Input validation is enforced on all endpoints
- No JWT authentication required (as requested)
- User identification is done via userId parameter 