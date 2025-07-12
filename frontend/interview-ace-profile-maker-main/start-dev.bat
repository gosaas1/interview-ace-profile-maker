@echo off
echo Starting ApplyAce Development Environment...
echo.

echo Starting Backend Server (Port 8080)...
start /B cmd /c "node server.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 3000)...
start /B cmd /c "npm run dev"

echo.
echo ✅ Both servers starting...
echo 📍 Backend: http://localhost:8080/api/health
echo 🌐 Frontend: http://localhost:3000
echo 🧪 Debug Tool: http://localhost:3000/debug/payment-debug
echo.
echo Press any key to stop all servers...
pause >nul

echo Stopping servers...
taskkill /F /IM node.exe >nul 2>&1
echo Servers stopped. 