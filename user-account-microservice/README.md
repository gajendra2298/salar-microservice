# User Account Microservice

This microservice handles user password management with two key features as specified in the requirements.

## Features

### 1. Change Password
Allows users to change their main password with the following validations:

**Required Fields:**
- **Old Password**: Current password validation
- **New Password**: New password with format validation
- **Confirm Password**: Must match new password
- **Transaction Password**: For verification

**Password Format Requirements:**
- Max length: 15 characters
- Must contain: One uppercase letter, one lowercase letter, one number, and one special character
- Pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]`

**API Endpoint:**
```
POST /user/change-password
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!",
  "transactionPassword": "TransPass123!"
}
```

### 2. Change Transaction Password
Allows users to change their transaction password using OTP verification:

**Step 1: Request OTP**
- **Mobile No**: Auto-filled from signup (disabled field)
- **Email ID**: Auto-filled from signup (disabled field)
- **Get OTP**: Sends 6-digit numeric OTP to both SMS and Email

**Step 2: Change Transaction Password**
- **Enter OTP**: 6-digit numeric validation
- **New Transaction Password**: New password with format validation
- **Confirm Transaction Password**: Must match new transaction password

**API Endpoints:**

1. **Request OTP:**
```
POST /user/change-transaction-password-request
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "emailId": "user@example.com",
  "mobileNo": "+919876543210"
}
```

2. **Change Transaction Password:**
```
POST /user/change-transaction-password
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "otp": "123456",
  "newTransactionPassword": "NewTransPass123!",
  "confirmTransactionPassword": "NewTransPass123!"
}
```

## Password Validation Rules

Both main password and transaction password follow the same format requirements:
- **Max Length**: 15 characters
- **Must Include**: 
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (@$!%*?&)

## OTP System

- **Format**: 6-digit numeric only
- **Delivery**: Sent to both email and SMS
- **SMS**: Only for Indian users
- **Validation**: OTP must be entered exactly as received

## Error Messages

- **Password Mismatch**: "New password and confirm password do not match"
- **Invalid Transaction Password**: "Invalid transaction password"
- **Invalid OTP**: "Please enter valid OTP"
- **Password Format**: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

Required environment variables (see `env.example`):
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `SEND_GRID_TOKEN`: SendGrid API key for email
- `SMS_USER`: SMS gateway username
- `SMS_PASSWORD`: SMS gateway password
- `SMS_SENDER`: SMS sender ID
- `PORT`: Server port (default: 3000) 