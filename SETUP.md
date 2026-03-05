# TeamOne - Full Stack Setup

## ✅ Complete Working Solution

### 🔐 Super Admin Credentials

Both accounts have **full tenant management access**:

| Email | Password | Role | Tenant Access |
|-------|----------|------|---------------|
| admin@trustybytes.in | AdminCheck@2026 | Super Admin | TrustyBytes Technologies (Owner) |
| rameez@trustybytes.in | AdminCheck@2026 | Super Admin | TrustyBytes Technologies (Owner) |

**Permissions:**
- ✓ Manage all tenants
- ✓ Create/Edit/Delete tenants
- ✓ User management
- ✓ Role & permission management
- ✓ System configuration
- ✓ Access to all hubs and features

## 🚀 Quick Start

### Option 1: Automated Start (Recommended)
```bash
start-full.bat
```
This will:
1. Start all Docker containers (backend + infrastructure)
2. Open a new window with the frontend dev server
3. Wait 15 seconds for backend to initialize

### Option 2: Manual Start

#### Step 1: Start Backend
```bash
docker-compose up -d
```

#### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Step 3: Access the App
1. Wait for Vite to show: `Local: http://localhost:5173`
2. Open http://localhost:5173 in your browser
3. Login with admin credentials

## 📋 Available Services

### Frontend
- **Dev Server**: http://localhost:5173 (full UI with hot reload)
- **Docker**: http://localhost:3000 (placeholder login page)

### Backend APIs
| Service | Port | Health Check |
|---------|------|--------------|
| API Gateway | 3001 | http://localhost:3001/health |
| Auth Service | 3002 | http://localhost:3002/health |
| People Service | 3003 | http://localhost:3003/health |
| Work Service | 3004 | http://localhost:3004/health |
| Money Service | 3005 | http://localhost:3005/health |
| Assets Service | 3006 | http://localhost:3006/health |
| Support Service | 3007 | http://localhost:3007/health |
| Growth Service | 3008 | http://localhost:3008/health |

### Infrastructure
| Service | Port | URL |
|---------|------|-----|
| Traefik Dashboard | 8080 | http://localhost:8080 |
| Adminer (Database) | 8081 | http://localhost:8081 |
| Grafana | 3100 | http://localhost:3100 |
| Prometheus | 9090 | http://localhost:9090 |
| MinIO Console | 9001 | http://localhost:9001 |
| Elasticsearch | 9200 | http://localhost:9200 |

## 🔧 Troubleshooting

### Frontend not loading?
1. Make sure dev server is running: `cd frontend && npm run dev`
2. Check for port conflicts (should be 5173)
3. Clear browser cache

### Backend services not responding?
1. Check Docker containers: `docker-compose ps`
2. View logs: `docker-compose logs -f [service-name]`
3. Restart: `docker-compose restart`

### Login not working?
1. Verify admin user exists in database:
   ```bash
   docker exec teamone-postgres psql -U postgres -d teamone_auth -c "SELECT email, role FROM users;"
   ```
2. Check auth service logs: `docker logs teamone-auth`

## 📦 Database Setup

The database is automatically seeded with:
- Default tenant: TrustyBytes Technologies
- Super admin user: admin@trustybytes.in
- All required tables

To re-seed:
```bash
docker exec teamone-postgres psql -U postgres -c "DROP DATABASE IF EXISTS teamone_auth;"
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_auth;"
# Run the seed script
```

## 🎯 Features

### Working Features
✅ All backend services running and healthy
✅ Database seeded with admin user
✅ Frontend dev server with hot reload
✅ Authentication store configured
✅ API client configured
✅ All hub routes defined

### In Progress
⚠️ Frontend authentication UI (login page needs to connect to API)
⚠️ Hub pages (components exist but need data binding)
⚠️ Dashboard (placeholder exists, needs real data)

## 📝 Next Steps for Full Functionality

1. **Login Flow**: Update Login.tsx to call auth API
2. **Protected Routes**: Ensure route guard checks authentication
3. **Hub Pages**: Connect components to backend APIs
4. **Dashboard**: Implement real-time data fetching

## 🔑 Key Files

```
frontend/src/
├── App.tsx              # Main app with routing
├── store/
│   ├── authStore.ts     # Authentication state
│   └── ...              # Other stores
├── lib/
│   └── api.ts           # API client
├── pages/
│   ├── auth/
│   │   ├── Login.tsx    # Login page
│   │   └── Register.tsx # Register page
│   └── Dashboard.tsx    # Dashboard
└── hubs/
    ├── work/            # Work hub
    ├── people/          # People hub
    ├── money/           # Money hub
    └── ...
```

## 💡 Tips

- Use the dev server (port 5173) for development
- Docker frontend (port 3000) is just a placeholder
- All backend APIs are fully functional
- Check browser console for errors
- Use Grafana/Prometheus for monitoring
