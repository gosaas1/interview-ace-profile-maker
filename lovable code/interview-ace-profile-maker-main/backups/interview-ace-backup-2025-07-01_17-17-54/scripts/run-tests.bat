@echo off
echo ================================================
echo  ApplyAce Payment System Test Runner
echo ================================================
echo.

REM Check if both servers are running
echo Checking if servers are running...
curl -s http://localhost:8080/api/health > nul
if %errorlevel% neq 0 (
    echo ❌ Backend server is not running on port 8080
    echo Please start the backend server first: npm run server
    pause
    exit /b 1
)

curl -s http://localhost:3000 > nul
if %errorlevel% neq 0 (
    echo ❌ Frontend server is not running on port 3000
    echo Please start the frontend server first: npm run dev
    pause
    exit /b 1
)

echo ✅ Both servers are running
echo.
echo Starting automated payment tests...
echo.

REM Run the test script
node scripts/test-payments.js

echo.
echo ================================================
echo Tests completed! Check the results above.
echo ================================================
pause 