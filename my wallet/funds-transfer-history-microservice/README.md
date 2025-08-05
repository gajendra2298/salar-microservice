# Funds Transfer History Microservice

A NestJS microservice for managing funds transfer history with Swagger UI documentation.

## Features

- RESTful API for funds transfer history
- Swagger UI documentation
- MongoDB integration
- Environment-based configuration
- Pagination and filtering support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or accessible via connection string)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application uses a `.env` file for configuration. Create or update the `.env` file in the root directory:

```env
# Application Configuration
PORT=3003
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/funds-transfer-history

# Swagger Configuration
SWAGGER_TITLE=Funds Transfer History API
SWAGGER_DESCRIPTION=API for managing funds transfer history
SWAGGER_VERSION=1.0
SWAGGER_PATH=api
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

### Debug Mode
```bash
npm run start:debug
```

## API Documentation

Once the application is running, you can access the Swagger UI documentation at:

```
http://localhost:3003/api
```

## API Endpoints

### POST /funds-transfer-history/listing

Get paginated funds transfer history with optional filtering.

**Request Body:**
```json
{
  "userId": "string",
  "page": 1,
  "pagesize": 10,
  "startDate": "2023-01-01",
  "endDate": "2023-12-31",
  "searchText": "optional search text",
  "sort": { "_id": -1 }
}
```

**Response:**
```json
{
  "status": 1,
  "data": [...],
  "page": 1,
  "pagesize": 10,
  "total": 100
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Application port | 3003 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/funds-transfer-history |
| SWAGGER_TITLE | Swagger API title | Funds Transfer History API |
| SWAGGER_DESCRIPTION | Swagger API description | API for managing funds transfer history |
| SWAGGER_VERSION | API version | 1.0 |
| SWAGGER_PATH | Swagger UI path | api |

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
src/
├── app.module.ts                 # Main application module
├── main.ts                      # Application bootstrap
└── funds-transfer-history/
    ├── funds-transfer-history.controller.ts
    ├── funds-transfer-history.service.ts
    └── schemas/
        └── funds.schema.ts
``` 