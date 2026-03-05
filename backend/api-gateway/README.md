# API Gateway Service

## Overview
The API Gateway routes all incoming requests to the appropriate microservices.

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Configuration

Environment variables:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Log level (debug/info/warn/error)
- `FRONTEND_URL` - Frontend URL for CORS
- `AUTH_SERVICE_URL` - Auth service URL
- `WORK_SERVICE_URL` - Work service URL
- `MONEY_SERVICE_URL` - Money service URL
- `ASSETS_SERVICE_URL` - Assets service URL
- `SUPPORT_SERVICE_URL` - Support service URL
- `GROWTH_SERVICE_URL` - Growth service URL
- `PEOPLE_SERVICE_URL` - People service URL

## API Endpoints

- `GET /health` - Health check
- `/api/auth/*` - Auth service proxy
- `/api/work/*` - Work service proxy
- `/api/money/*` - Money service proxy
- `/api/assets/*` - Assets service proxy
- `/api/support/*` - Support service proxy
- `/api/growth/*` - Growth service proxy
- `/api/people/*` - People service proxy

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```
