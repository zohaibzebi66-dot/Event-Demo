@echo off
echo Starting Event Info Demo...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Run 'npm start' in the backend folder (port 5000)
echo 2. Run 'npm start' in the frontend folder (port 3000)
echo.
echo Or use the provided start scripts:
echo - start-backend.bat
echo - start-frontend.bat
echo.
pause
