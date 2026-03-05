@echo off
echo ========================================
echo TeamOne - Docker Stop
echo ========================================
echo.

echo Stopping all containers...
docker-compose down --remove-orphans

echo.
echo ========================================
echo All services stopped.
echo ========================================
echo.
echo To start again: start-docker.bat
echo.
