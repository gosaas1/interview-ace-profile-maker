# Interview Ace Profile Maker - Backup Script
# Run this script to create a backup of your project

Write-Host "Starting project backup..." -ForegroundColor Green

# Get current date and time
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "interview-ace-backup-$timestamp"

# Create backup directory
$backupDir = ".\backups\$backupName"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host "Creating backup in: $backupDir" -ForegroundColor Yellow

# Copy project files (excluding node_modules and other unnecessary files)
$excludePatterns = @(
    "node_modules",
    "dist",
    "build",
    ".git",
    "backups",
    "*.log",
    "*.tmp"
)

# Copy files
Get-ChildItem -Path "." -Recurse | Where-Object {
    $shouldExclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($_.FullName -like "*$pattern*") {
            $shouldExclude = $true
            break
        }
    }
    return -not $shouldExclude
} | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    $targetPath = Join-Path $backupDir $relativePath
    
    if ($_.PSIsContainer) {
        New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
    } else {
        $targetDir = Split-Path $targetPath -Parent
        if (!(Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        Copy-Item $_.FullName $targetPath
    }
}

# Create backup info file
$backupInfo = @"
Backup Information
==================
Date: $(Get-Date)
Project: Interview Ace Profile Maker
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git branch --show-current)
Node Version: $(node --version)
NPM Version: $(npm --version)

Files backed up:
$(Get-ChildItem -Path $backupDir -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count) files

Recovery Instructions:
1. Copy all files from this backup to a new directory
2. Run 'npm install' to install dependencies
3. Run 'npm run dev' to start development server
"@

$backupInfo | Out-File -FilePath "$backupDir\BACKUP_INFO.txt" -Encoding UTF8

Write-Host "Backup completed successfully!" -ForegroundColor Green
Write-Host "Backup location: $backupDir" -ForegroundColor Cyan
Write-Host "Total files backed up: $(Get-ChildItem -Path $backupDir -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Cyan

# Create Git backup
Write-Host "Creating Git backup..." -ForegroundColor Yellow
git add .
git commit -m "Backup: $timestamp - Automated backup before changes"
git push origin main

Write-Host "Git backup completed!" -ForegroundColor Green
Write-Host "Your project is now safely backed up locally and on GitHub." -ForegroundColor Green 