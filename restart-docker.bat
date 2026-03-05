@echo off
echo ========================================
echo TeamOne - Docker Restart
echo ========================================
echo.

echo [1/3] Stopping all containers...
docker-compose down

echo.
echo [2/3] Starting all services...
docker-compose up -d

echo.
echo [3/3] Waiting for services to initialize...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo TeamOne Services Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Access Points
echo ========================================
echo.
echo Frontend:       http://localhost:3000
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
