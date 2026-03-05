@echo off
echo ========================================
echo TeamOne - Docker Start
echo ========================================
echo.

echo [1/4] Stopping any existing containers...
docker-compose down --remove-orphans 2>nul

echo.
echo [2/4] Building images...
echo Note: This may take several minutes on first run
docker-compose build --no-cache

echo.
echo [3/4] Starting all services...
docker-compose up -d

echo.
echo [4/4] Waiting for services to initialize...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo TeamOne Services Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Starting Frontend Development Server...
echo ========================================
echo.

REM Start frontend dev server in a new window
start "TeamOne Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Access Points
echo ========================================
echo.
echo Frontend:       http://localhost:3000 (placeholder)
echo Frontend (Dev): Wait for dev server to start...
echo API Gateway:    http://localhost:3001
echo Grafana:        http://localhost:3100
echo Adminer:        http://localhost:8081
echo Prometheus:     http://localhost:9090
echo Elasticsearch:  http://localhost:9200
echo MinIO Console:  http://localhost:9001
echo Traefik Dashboard: http://localhost:8080
echo.
echo Backend Services:
echo   Auth:    http://localhost:3002
echo   People:  http://localhost:3003
echo   Work:    http://localhost:3004
echo   Money:   http://localhost:3005
echo   Assets:  http://localhost:3006
echo   Support: http://localhost:3007
echo   Growth:  http://localhost:3008
echo.
echo ========================================
echo To view logs: logs-docker.bat [service-name]
echo To stop:      stop-docker.bat
echo ========================================
echo.
echo NOTE: Frontend dev server will start in a new window.
echo Use the URL shown in that window (e.g., http://localhost:5173)
echo ========================================
echo.
