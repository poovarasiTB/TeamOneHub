@echo off
echo ========================================
echo TeamOne - Full Stack Start
echo ========================================
echo.

echo [1/3] Starting Docker services...
docker-compose up -d

echo.
echo [2/3] Waiting for backend to initialize...
timeout /t 15 /nobreak >nul

echo.
echo [3/3] Starting Frontend Development Server...
echo.

REM Create a new window for frontend
start "TeamOne Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo TeamOne is starting!
echo ========================================
echo.
echo Backend Services:
echo   Frontend (Docker): http://localhost:3000
echo   API Gateway:       http://localhost:3001
echo   Auth Service:      http://localhost:3002
echo.
echo Frontend Dev Server:
echo   Will open in a new window
echo   Wait for "Local: http://localhost:5173"
echo   Then open that URL in your browser
echo.
echo Login Credentials:
echo   Email:    admin@trustybytes.in
echo   Password: AdminCheck@2026
echo.
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
