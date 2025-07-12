@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
echo.
echo Waiting 2 seconds for processes to terminate...
timeout /t 2 /nobreak >nul
echo.
echo Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run server"
echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul
echo.
echo Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"
echo.
echo Both servers should now be running:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3000
echo.
pause 