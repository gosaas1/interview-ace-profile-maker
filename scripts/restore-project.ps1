# CV Builder Project Restoration Script
# This script automates the setup process for recreating the project from scratch

Write-Host "🚀 CV Builder Project Restoration Script" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Create project structure
Write-Host "Creating project structure..." -ForegroundColor Yellow
$projectDir = "cv-builder-restored"
if (Test-Path $projectDir) {
    Write-Host "⚠️  Project directory already exists. Removing..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $projectDir
}

New-Item -ItemType Directory -Path $projectDir
Set-Location $projectDir

# Create backend and frontend directories
New-Item -ItemType Directory -Path "backend"
New-Item -ItemType Directory -Path "frontend"
New-Item -ItemType Directory -Path "scripts"

Write-Host "✅ Project structure created" -ForegroundColor Green

# Setup Backend
Write-Host "Setting up backend..." -ForegroundColor Yellow
Set-Location "backend"

# Create package.json
$backendPackageJson = @"
{
  "name": "cv-builder-backend",
  "version": "1.0.0",
  "description": "Backend API for CV Builder application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "mammoth": "^1.6.0",
    "pdf-parse": "^1.1.1",
    "@supabase/supabase-js": "^2.38.0",
    "uuid": "^9.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "stripe": "^14.7.0",
    "openai": "^4.20.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/cors": "^2.8.17",
    "@types/multer": "^1.4.11",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.2"
  }
}
"@

$backendPackageJson | Out-File -FilePath "package.json" -Encoding UTF8

# Create .env template
$backendEnv = @"
# Server Configuration
PORT=8080
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
"@

$backendEnv | Out-File -FilePath ".env.example" -Encoding UTF8

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✅ Backend setup complete" -ForegroundColor Green

# Setup Frontend
Write-Host "Setting up frontend..." -ForegroundColor Yellow
Set-Location "../frontend"

# Create package.json
$frontendPackageJson = @"
{
  "name": "cv-builder-frontend",
  "version": "1.0.0",
  "description": "Frontend for CV Builder application",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "@supabase/supabase-js": "^2.38.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "stripe": "^14.7.0",
    "react-pdf": "^7.6.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "framer-motion": "^10.16.16",
    "react-hot-toast": "^2.4.1",
    "sonner": "^1.2.4",
    "nuqs": "^1.15.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
"@

$frontendPackageJson | Out-File -FilePath "package.json" -Encoding UTF8

# Create .env template
$frontendEnv = @"
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OpenAI Configuration (if needed on frontend)
VITE_OPENAI_API_KEY=your_openai_api_key
"@

$frontendEnv | Out-File -FilePath ".env.example" -Encoding UTF8

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✅ Frontend setup complete" -ForegroundColor Green

# Create README
Set-Location ".."
$readme = @"
# CV Builder Project - Restored

This project has been restored using the automated restoration script.

## Quick Start

1. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Update with your actual API keys and configuration

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Next Steps

1. Set up your Supabase database using the schema in `PROJECT_BACKUP_GUIDE.md`
2. Configure your Stripe account for payments
3. Set up your OpenAI API key for AI features
4. Customize the application according to your needs

## Documentation

See `PROJECT_BACKUP_GUIDE.md` for complete documentation and setup instructions.

## Support

If you encounter any issues during restoration, refer to the troubleshooting section in the backup guide.
"@

$readme | Out-File -FilePath "README.md" -Encoding UTF8

Write-Host "✅ Project restoration complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure environment variables in backend/.env and frontend/.env" -ForegroundColor White
Write-Host "2. Set up your Supabase database" -ForegroundColor White
Write-Host "3. Start the development servers" -ForegroundColor White
Write-Host "4. Access the application at http://localhost:3000" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Green 