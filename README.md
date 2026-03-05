# TeamOne - Complete Development Repository

## 🚀 Quick Start

```bash
# Clone and setup
cd development

# Generate secrets
./scripts/generate-secrets.sh

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access applications
# Frontend: http://localhost:3000
# API: http://localhost:3001
# Adminer (DB): http://localhost:8080
```

## 📁 Project Structure

```
development/
├── docker-compose.yml          # Main orchestration
├── docker-compose.dev.yml      # Development overrides
├── scripts/                    # Automation scripts
│   ├── generate-secrets.sh
│   ├── backup.sh
│   └── deploy.sh
├── secrets/                    # Docker secrets (gitignored)
├── backend/                    # Backend services
│   ├── api-gateway/
│   ├── auth-service/
│   ├── people-service/
│   ├── work-service/
│   └── ...
├── frontend/                   # React PWA
│   ├── src/
│   │   ├── components/
│   │   ├── hubs/
│   │   ├── hooks/
│   │   └── ...
│   └── ...
├── database/                   # Database scripts
│   ├── migrations/
│   ├── seeds/
│   └── init-scripts/
└── docs/                       # Documentation
    ├── api/
    ├── deployment/
    └── testing/
```

## 🏗️ Architecture

- **Frontend:** React 18 + TypeScript + Vite + PWA
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL 16 + MongoDB 7
- **Cache:** Redis 7
- **Search:** Elasticsearch 8
- **Event Bus:** Apache Kafka
- **Reverse Proxy:** Traefik 3

## 🧪 Testing

```bash
# Run all tests
npm run test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# With coverage
npm run test:coverage
```

## 📊 Test Results

See [TEST-RESULTS.md](./docs/testing/TEST-RESULTS.md) for latest test results.

## 🚢 Deployment

See [DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md) for production deployment guide.

---

**Status:** Production Ready
**Version:** 1.0.0
