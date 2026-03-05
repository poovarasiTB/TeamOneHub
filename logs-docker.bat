@echo off
echo ========================================
echo TeamOne - Docker Logs
echo ========================================
echo.

if "%1"=="" (
    echo Showing logs for all services...
    echo Press Ctrl+C to stop
    echo.
    docker-compose logs -f
) else (
    echo Showing logs for service: %1
    echo Press Ctrl+C to stop
    echo.
    docker-compose logs -f %1
)
