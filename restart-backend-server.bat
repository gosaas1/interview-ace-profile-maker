@echo off
REM Kill any process using port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Killing process on port 8000: %%a
    taskkill /PID %%a /F
)

REM Go to backend directory
cd backend

REM Build backend (if using TypeScript)
if exist tsconfig.json (
    echo Building backend TypeScript...
    npm run build
)

REM Start backend server and log output
echo Starting backend server...
start "Backend Server" cmd /k "npm run server"

REM Wait a few seconds for server to start
timeout /t 5

REM Check health endpoint
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8000/api/health' -UseBasicParsing; if ($r.StatusCode -eq 200) { Write-Host '✅ Backend is running and healthy!' } else { Write-Host '❌ Backend health check failed.' } } catch { Write-Host '❌ Backend not reachable.' }" 