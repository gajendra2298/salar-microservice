# Sponsor Team Microservice

A NestJS microservice for managing sponsor team functionality with search, filtering, and pagination support.

## Features

- Add sponsor team members
- Get sponsor team list with search and filtering
- Pagination support
- User authentication integration
- MongoDB integration with Mongoose
- JWT authentication

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Environment Variables

Create a `.env` file with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/sponsor-team-microservice
JWT_SECRET=your-jwt-secret
PORT=3002
```

## API Documentation

### Base URL
```
http://localhost:3002
```

### Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 1. Add Sponsor Team Member
**POST** `/sponsor-team/add`

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "sponsor_id": "SP001",
  "doj": "2024-01-01",
  "user_name": "John Doe",
  "email_id": "john@example.com",
  "registerId": "REG001",
  "sponsor_name": "Sponsor Name"
}
```

**Required Fields:**
- `user_id`: MongoDB ObjectId of the user
- `sponsor_id`: Sponsor identifier
- `doj`: Date of joining
- `user_name`: Name of the user

**Optional Fields:**
- `email_id`: Email address
- `registerId`: Registration ID
- `sponsor_name`: Sponsor name

**Response:**
```json
{
  "status": 1,
  "message": "Sponsor team member added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user_id": "507f1f77bcf86cd799439011",
    "sponsor_id": "SP001",
    "doj": "2024-01-01",
    "user_name": "John Doe",
    "email_id": "john@example.com",
    "registerId": "REG001",
    "sponsor_name": "Sponsor Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get Sponsor Team List
**POST** `/sponsor-team/list`

**Request Body:**
```json
{
  "searchText": "John",
  "filter": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "currentPage": 1,
  "itemsPerPage": 10
}
```

**Optional Parameters:**
- `searchText`: Search by user name or registration ID (alphanumeric, max 30 characters)
- `filter.startDate`: Start date for filtering (YYYY-MM-DD format)
- `filter.endDate`: End date for filtering (YYYY-MM-DD format)
- `currentPage`: Page number (default: 1)
- `itemsPerPage`: Items per page (default: 10)

**Response:**
```json
{
  "status": 1,
  "data": [
    {
      "user_name": "John Doe",
      "email_id": "john@example.com",
      "registerId": "REG001",
      "sponsor_name": "Sponsor Name",
      "sponsor_id": "SP001",
      "doj": "2024-01-01",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "profileImg": "https://example.com/profile.jpg",
      "gender": "male"
    }
  ],
  "count": 1,
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalPages": 1
  }
}
```

## Database Schema

The microservice uses the following MongoDB schema:

```typescript
{
  user_id: ObjectId,      // Reference to Users collection
  sponsor_id: String,      // Sponsor identifier
  doj: String,            // Date of joining
  user_name: String,       // User name
  email_id: String,        // Email address
  registerId: String,      // Registration ID
  sponsor_name: String,    // Sponsor name
  createdAt: Date,         // Created timestamp
  updatedAt: Date          // Updated timestamp
}
```

## Search and Filtering

### Search Validation
- Search text must be alphanumeric
- Maximum length: 30 characters
- Searches in both `user_name` and `registerId` fields

### Date Filtering
- Supports date range filtering using `startDate` and `endDate`
- Date format: YYYY-MM-DD
- Filters based on `createdAt` field

### Pagination
- Default page size: 10 items
- Returns pagination metadata including total count and total pages

## Error Handling

The microservice returns consistent error responses:

```json
{
  "status": 0,
  "message": "Error description"
}
```

Common error scenarios:
- Missing required fields
- Invalid user authentication
- Database connection issues
- Validation errors

## Development

### Project Structure
```
src/
├── auth/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── auth.module.ts
├── sponsor-team/
│   ├── controllers/
│   │   └── sponsor-team.controller.ts
│   ├── dto/
│   │   ├── add-sponsor-team.dto.ts
│   │   └── get-sponsor-team.dto.ts
│   ├── schemas/
│   │   └── sponsor-team.schema.ts
│   ├── services/
│   │   └── sponsor-team.service.ts
│   └── sponsor-team.module.ts
├── app.module.ts
└── main.ts
```

### Adding New Features

1. Create DTOs in `src/sponsor-team/dto/`
2. Add service methods in `src/sponsor-team/services/sponsor-team.service.ts`
3. Create controller endpoints in `src/sponsor-team/controllers/sponsor-team.controller.ts`
4. Update schema if needed in `src/sponsor-team/schemas/sponsor-team.schema.ts`
5. Write tests in `test/` directory

## Dependencies

- **@nestjs/common**: Core NestJS functionality
- **@nestjs/mongoose**: MongoDB integration
- **@nestjs/jwt**: JWT authentication
- **@nestjs/passport**: Passport authentication
- **mongoose**: MongoDB ODM
- **moment**: Date manipulation
- **class-validator**: DTO validation
- **class-transformer**: Object transformation 