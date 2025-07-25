# PowerShell restart script for AI CV Application
Write-Host "🔄 Restarting AI CV Application..." -ForegroundColor Yellow

# Function to kill process by port
function Kill-ProcessByPort {
    param([int]$Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($processes) {
        foreach ($process in $processes) {
            try {
                Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
                Write-Host "✅ Killed process using port $Port (PID: $($process.OwningProcess))" -ForegroundColor Green
            } catch {
                Write-Host "⚠️  Could not kill process on port $Port" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "ℹ️  No process found using port $Port" -ForegroundColor Cyan
    }
}

# Kill all Node.js processes
Write-Host "📋 Killing Node.js processes..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill all Vite processes
Write-Host "📋 Killing Vite processes..." -ForegroundColor Cyan
Get-Process -Name "vite" -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Check and kill processes on specific ports
Write-Host "🔍 Checking port availability..." -ForegroundColor Cyan
Kill-ProcessByPort -Port 3000
Kill-ProcessByPort -Port 8000

# Wait another moment
Start-Sleep -Seconds 1

# Verify ports are free
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "❌ Port 3000 still in use after cleanup" -ForegroundColor Red
} else {
    Write-Host "✅ Port 3000 is free" -ForegroundColor Green
}

if ($port8000) {
    Write-Host "❌ Port 8000 still in use after cleanup" -ForegroundColor Red
} else {
    Write-Host "✅ Port 8000 is free" -ForegroundColor Green
}

# Start the development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
npm run dev 