# Start ApplyAce Development Servers
# This script starts both backend and frontend servers

Write-Host "🚀 Starting ApplyAce Development Servers..." -ForegroundColor Green

# Start Backend Server
Write-Host "📡 Starting Backend Server (Port 8080)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run server"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server  
Write-Host "🎨 Starting Frontend Server (Port 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host "📍 Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Health Check: http://localhost:8080/api/health" -ForegroundColor Cyan 