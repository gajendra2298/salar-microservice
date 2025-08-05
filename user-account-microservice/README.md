# User Module Microservice

A NestJS microservice for user management with password and transaction password functionality, including OTP verification via SMS and email.

## Features

### (i) Change Password
- **Enter Old Password**: Validates current password
- **Enter New Password**: New password with validation (max 15 characters, must contain uppercase, lowercase, number, and special character)
- **Transaction Password**: Required for password change verification

### (ii) Change Transaction Password
- **Change Transaction Password Request**: Sends OTP to both SMS and email
- **Enter OTP**: 6-character alphanumeric validation
- **Enter New Transaction Password**: New transaction password with validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- SendGrid account (for email)
- Bulk SMS Gateway account (for SMS)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   copy env.example .env
   ```

4. Configure your environment variables in `.env`:
   - MongoDB connection string
   - JWT secret
   - SendGrid API key
   - Bulk SMS Gateway credentials

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### 1. Change Password
**POST** `/user/change-password`

**Headers:**
- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "transactionPassword": "TransPass123!"
}
```

**Response:**
```json
{
  "status": 1,
  "message": "Password updated successfully"
}
```

---

### 2. Change Transaction Password Request (Send OTP)
**POST** `/user/change-transaction-password-request`

**Headers:**
- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "emailId": "user@example.com",
  "mobileNo": "+1234567890"
}
```

**Response:**
```json
{
  "status": 1,
  "message": "OTP sent successfully"
}
```

---

### 3. Change Transaction Password
**POST** `/user/change-transaction-password`

**Headers:**
- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "otp": "ABC123",
  "newTransactionPassword": "NewTransPass123!"
}
```

**Response:**
```json
{
  "status": 1,
  "message": "Transaction password updated successfully"
}
```

---

### 4. Get User Profile
**GET** `/user/profile`

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Response:**
```json
{
  "_id": "...",
  "fullName": "...",
  "emailId": "...",
  ...
}
```

---

## Validation Rules

### Password Validation
- Maximum length: 15 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

### OTP Validation
- Maximum length: 6 characters
- Alphanumeric only (A-Z, a-z, 0-9)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/user-microservice |
| JWT_SECRET | JWT signing secret | your-secret-key |
| SEND_GRID_TOKEN | SendGrid API key | - |
| SMS_USER | Bulk SMS Gateway username | - |
| SMS_PASSWORD | Bulk SMS Gateway password | - |
| SMS_SENDER | Bulk SMS Gateway sender ID | - |
| SMS_TRANS_PASSWORD_OTP_TEMPLATEID | SMS template ID | - |
| PORT | Server port | 3000 |

## Error Handling

The service includes comprehensive error handling for:
- Invalid passwords
- Password mismatch
- Invalid OTP
- User not found
- Validation errors

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS enabled
- Environment-based configuration

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 