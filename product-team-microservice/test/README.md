# Product Team Microservice - Swagger Test Data

This directory contains comprehensive test data and integration tests for the Product Team microservice that work seamlessly with Swagger UI.

## Files Overview

### 1. `swagger-test-data.ts`
Contains all the test data needed for Swagger UI testing:

- **Request Data**: Valid and invalid test data for all endpoints
- **Response Data**: Mock response examples for all endpoints
- **Authentication**: JWT tokens for testing authentication
- **Test Scenarios**: Complete scenarios for different use cases

### 2. `swagger-integration.test.ts`
Comprehensive integration tests that use the test data:

- Tests all endpoints with valid and invalid data
- Tests authentication scenarios
- Tests validation errors
- Tests error handling

### 3. `product-team.test.ts`
Original unit tests for the service layer.

## How to Use with Swagger

### 1. Starting the Service
```bash
# Navigate to the product-team-microservice directory
cd product-team-microservice

# Install dependencies
npm install

# Start the service
npm run start:dev
```

### 2. Accessing Swagger UI
Once the service is running, access Swagger UI at:
```
http://localhost:3003/api
```

### 3. Using Test Data in Swagger

#### For POST /product-team/add-team-member:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "teamMemberId": "507f1f77bcf86cd799439012"
}
```

#### For POST /product-team/pending-members:
```json
{
  "searchText": "john"
}
```

#### For GET endpoints:
Use the Authorization header:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInVzZXJJZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJlZ2lzdGVySWQiOiJURUFNMDAxIiwiaWF0IjoxNzA1NzM5NjAwLCJleHAiOjE3MDU4MjYwMDB9.example-signature
```

## Test Data Examples

### Valid Test Data
```typescript
// Add Team Member
{
  userId: "507f1f77bcf86cd799439011",
  teamMemberId: "507f1f77bcf86cd799439012"
}

// Get Pending Team Members
{
  searchText: "john"
}

// Get Team Tree
{
  searchText: "alice",
  level: 3,
  registerId: "507f1f77bcf86cd799439011"
}
```

### Invalid Test Data (for error testing)
```typescript
// Invalid MongoDB ObjectId
{
  userId: "invalid-mongo-id",
  teamMemberId: "507f1f77bcf86cd799439012"
}

// Missing required fields
{
  userId: "507f1f77bcf86cd799439011"
  // teamMemberId is missing
}
```

## Running Tests

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Specific Test Files
```bash
# Run only Swagger integration tests
npm run test swagger-integration.test.ts

# Run only unit tests
npm run test product-team.test.ts
```

## Expected Responses

### Success Response Format
```json
{
  "status": 1,
  "message": "Operation completed successfully",
  "data": [...]
}
```

### Error Response Format
```json
{
  "status": 0,
  "message": "Error description"
}
```

## Authentication

All endpoints require JWT authentication. Use the provided test tokens:

- **Valid Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Expired Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Invalid Token**: `invalid.jwt.token`

## Test Scenarios

### 1. Add Team Member
- ✅ Success with valid data
- ❌ Validation error with invalid MongoDB ObjectId
- ❌ Missing required fields
- ❌ Unauthorized without JWT token

### 2. Get Pending Team Members
- ✅ With search text
- ✅ Without search text
- ✅ With special characters
- ❌ Unauthorized without JWT token

### 3. Get Team Tree
- ✅ Current user's team tree
- ✅ By register ID with level parameter
- ✅ Invalid register ID handling
- ❌ Unauthorized without JWT token

### 4. Network Count
- ✅ Get network statistics
- ❌ Unauthorized without JWT token

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Make sure to include the Authorization header with a valid JWT token
2. **400 Bad Request**: Check that all required fields are provided and valid
3. **500 Internal Server Error**: Check server logs for detailed error information

### Debug Mode
To run tests in debug mode:
```bash
npm run test:debug
```

## Contributing

When adding new endpoints or modifying existing ones:

1. Update the test data in `swagger-test-data.ts`
2. Add corresponding tests in `swagger-integration.test.ts`
3. Update this README with new examples
4. Ensure all tests pass before committing

## Notes

- All MongoDB ObjectIds in test data are valid 24-character hex strings
- JWT tokens are examples and may need to be updated for your specific JWT secret
- Test data is designed to be realistic but not production data
- All endpoints follow the standard response format with `status` and `message` fields 