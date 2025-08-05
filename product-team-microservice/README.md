# Product Team Microservice

A NestJS microservice for managing product referral teams with levels, team tables, and team views with upliner data.

## Features

- Product referral tree and levels management
- Team table with level, required/joined members, and status
- Team view with upliner data
- Search functionality with validation
- JWT authentication
- MongoDB integration with Mongoose

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
MONGODB_URI=mongodb://localhost:27017/product-team-microservice
JWT_SECRET=your-jwt-secret
PORT=3003
```

## API Documentation

### Base URL
```
http://localhost:3003
```

### Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 1. Get Pending Team Members
**POST** `/product-team/pending-members`

**Request Body:**
```json
{
  "searchText": "customer"
}
```

**Search Validation:**
- Search text must be alphanumeric
- Maximum length: 30 characters
- Searches in Customer Registered ID and Name

**Response:**
```json
{
  "status": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "ulDownlineId": "TEST001",
      "registerId": "PEND001",
      "emailId": "pending1@example.com",
      "fullName": "Pending User 1",
      "organisationName": "Test Org 1"
    }
  ]
}
```

#### 2. Get Pending Level Details
**GET** `/product-team/pending-level-details`

**Response:**
```json
{
  "status": 1,
  "data": [
    {
      "level": 1,
      "vacantPlace": 2,
      "fullName": "Test User",
      "emailId": "test@example.com",
      "registerId": "TEST001",
      "_id": "507f1f77bcf86cd799439011"
    }
  ]
}
```

#### 3. Add Team Member
**POST** `/product-team/add-team-member`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "teamMemberId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "status": 1,
  "message": "User details updated successfully"
}
```

#### 4. Get Team Tree Details
**GET** `/product-team/team-tree`

**Response:**
```json
{
  "status": 1,
  "data": [
    {
      "level": 1,
      "requiredMembers": 1,
      "joinedMembers": 2,
      "status": "Pending",
      "earnings": 0,
      "users": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "registerId": "U001",
          "emailId": "user1@example.com",
          "fullName": "User 1",
          "imageUrl": "https://example.com/image1.jpg",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "gender": "male",
          "mainUser": {
            "_id": "507f1f77bcf86cd799439012",
            "fullName": "Main User",
            "emailId": "main@example.com",
            "registerId": "MAIN001"
          }
        }
      ]
    }
  ]
}
```

#### 5. Get Team Tree Details by Register ID
**GET** `/product-team/team-tree/:registerId?level=1`

**Response:**
```json
{
  "status": 1,
  "data": {
    "level": 1,
    "requiredMembers": 1,
    "joinedMembers": 2,
    "status": "Pending",
    "earnings": 0
  }
}
```

#### 6. Get First Level Details
**GET** `/product-team/first-level/:registerId`

**Response:**
```json
{
  "status": 1,
  "data": {
    "requiredMembers": 1,
    "joinedMembers": 2,
    "status": "Pending",
    "earnings": 0
  }
}
```

#### 7. Get Network Team Count
**GET** `/product-team/network-count`

**Response:**
```json
{
  "status": 1,
  "data": {
    "networkTeamCount": 5
  }
}
```

## Database Schema

### Team Levels Schema
```typescript
{
  width: Number,        // Team width
  depth: Number,        // Team depth
  ULDownline: Number,   // Upline/Downline count
  isDeleted: Boolean,   // Soft delete flag
  status: Boolean,      // Active status
  createdAt: Date,      // Created timestamp
  updatedAt: Date       // Updated timestamp
}
```

## Team Table Structure

The microservice provides team table data with the following columns:

1. **Level No** - Team level number
2. **Required Members** - Number of members required for the level
3. **Joined Members** - Number of members currently joined
4. **Status** - Team status (Pending/Completed)
5. **Team (view)** - Interactive link to detailed team view

## Team View Details

When clicking on "Team (view)", the detailed view shows:

1. **S.No.** - Serial Number
2. **Level No** - Team level
3. **Customer ID** - Customer registration ID
4. **Customer Name** - Customer full name
5. **Upliner Registered ID** - Upliner's registration ID
6. **Upliner Name** - Upliner's full name

## Search and Filtering

### Search Validation
- Search text must be alphanumeric
- Maximum length: 30 characters
- Searches in Customer Registered ID and Name

### Team Levels
- Supports configurable team width and depth
- Tracks pending and completed levels
- Provides level-wise member counts

## Error Handling

The microservice returns consistent error responses:

```json
{
  "status": 0,
  "message": "Error description"
}
```

Common error scenarios:
- User not found
- Invalid team member allocation
- No available slots in team
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
├── product-team/
│   ├── controllers/
│   │   └── product-team.controller.ts
│   ├── dto/
│   │   ├── get-pending-team-members.dto.ts
│   │   ├── add-team-member.dto.ts
│   │   └── get-team-tree.dto.ts
│   ├── schemas/
│   │   └── team-levels.schema.ts
│   ├── services/
│   │   └── product-team.service.ts
│   └── product-team.module.ts
├── app.module.ts
└── main.ts
```

### Adding New Features

1. Create DTOs in `src/product-team/dto/`
2. Add service methods in `src/product-team/services/product-team.service.ts`
3. Create controller endpoints in `src/product-team/controllers/product-team.controller.ts`
4. Update schema if needed in `src/product-team/schemas/team-levels.schema.ts`
5. Write tests in `test/` directory

## Dependencies

- **@nestjs/common**: Core NestJS functionality
- **@nestjs/mongoose**: MongoDB integration
- **@nestjs/jwt**: JWT authentication
- **@nestjs/passport**: Passport authentication
- **mongoose**: MongoDB ODM
- **lodash**: Utility functions
- **class-validator**: DTO validation
- **class-transformer**: Object transformation 