@echo off
echo ========================================
echo TeamOne Development Environment
echo ========================================
echo.

REM Check if running infrastructure-only mode
if "%1"=="infra" (
    echo Starting infrastructure with Docker...
    docker-compose -f docker-compose.infra.yml up -d
    timeout /t 10 /nobreak >nul
    goto START_SERVICES
)

REM Check if running full Docker mode
if "%1"=="docker" (
    echo Starting full Docker environment...
    docker-compose up -d
    echo.
    echo Frontend: http://localhost:3000
    echo API Gateway: http://localhost:3001
    goto END
)

REM Default: Local development mode
:START_SERVICES
echo Starting services locally...
echo.

REM Start Auth Service
echo [1/8] Starting Auth Service...
start "Auth Service" cmd /k "cd backend\services\auth && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Work Service
echo [2/8] Starting Work Service...
start "Work Service" cmd /k "cd backend\services\work && npm run dev"
timeout /t 2 /nobreak >nul

REM Start People Service
echo [3/8] Starting People Service...
start "People Service" cmd /k "cd backend\services\people && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Money Service
echo [4/8] Starting Money Service...
start "Money Service" cmd /k "cd backend\services\money && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Assets Service
echo [5/8] Starting Assets Service...
start "Assets Service" cmd /k "cd backend\services\assets && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Support Service
echo [6/8] Starting Support Service...
start "Support Service" cmd /k "cd backend\services\support && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Growth Service
echo [7/8] Starting Growth Service...
start "Growth Service" cmd /k "cd backend\services\growth && npm run dev"
timeout /t 2 /nobreak >nul

REM Start API Gateway
echo [8/8] Starting API Gateway...
start "API Gateway" cmd /k "cd backend\api-gateway && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Frontend
echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All services starting...
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo API Gateway: http://localhost:3001
echo.
echo Services:
echo   - Auth:    http://localhost:3002
echo   - People:  http://localhost:3003
echo   - Work:    http://localhost:3004
echo   - Money:   http://localhost:3005
echo   - Assets:  http://localhost:3006
echo   - Support: http://localhost:3007
echo   - Growth:  http://localhost:3008
echo.
echo Press any key to exit this window...
pause >nul

:END
