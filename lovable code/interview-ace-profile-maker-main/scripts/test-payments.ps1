#!/usr/bin/env pwsh

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " ApplyAce Payment System Test Runner" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if both servers are running
Write-Host "Checking if servers are running..." -ForegroundColor Yellow

try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend server is running on port 8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend server is not running on port 8080" -ForegroundColor Red
    Write-Host "Please start the backend server first: npm run server" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend server is running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend server is not running on port 3000" -ForegroundColor Red
    Write-Host "Please start the frontend server first: npm run dev" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting automated payment tests..." -ForegroundColor Yellow
Write-Host ""

# Install dependencies if needed
if (-not (Test-Path "node_modules/node-fetch")) {
    Write-Host "Installing test dependencies..." -ForegroundColor Yellow
    npm install node-fetch chalk
}

# Run the test script
node scripts/test-payments.js

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Tests completed! Check the results above." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit" 