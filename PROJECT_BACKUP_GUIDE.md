# CV Builder Project - Complete Backup Guide

## Project Overview
This document contains everything needed to recreate the CV Builder project from scratch, including all dependencies, code structure, setup instructions, and configuration files.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Dependencies & Packages](#dependencies--packages)
3. [Environment Setup](#environment-setup)
4. [Database Schema](#database-schema)
5. [Key Features & Components](#key-features--components)
6. [API Endpoints](#api-endpoints)
7. [Configuration Files](#configuration-files)
8. [Setup Instructions](#setup-instructions)
9. [Development Workflow](#development-workflow)

---

## Project Structure

```
Ai CV Application/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── tests/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── server.js
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── cv/
│   │   │   ├── cv-builder/
│   │   │   ├── dashboard/
│   │   │   ├── homepage/
│   │   │   ├── navigation/
│   │   │   └── ui/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.cjs
└── supabase/
    └── schema.sql
```

---

## Dependencies & Packages

### Backend Dependencies (package.json)
```json
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
```

### Frontend Dependencies (package.json)
```json
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
```

---

## Environment Setup

### Backend Environment Variables (.env)
```env
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
```

### Frontend Environment Variables (.env)
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OpenAI Configuration (if needed on frontend)
VITE_OPENAI_API_KEY=your_openai_api_key
```

---

## Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CVs table
CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  template_id VARCHAR(100),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV Skills junction table
CREATE TABLE cv_skills (
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (cv_id, skill_id)
);

-- Job Applications table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  job_url TEXT,
  status VARCHAR(50) DEFAULT 'applied',
  applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis table
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  job_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Key Features & Components

### 1. CV Builder Stepper
- **Component**: `CVBuilderStepper.tsx`
- **Features**: 
  - Template selection as first step
  - Multi-step form with validation
  - Live preview with sample data toggle
  - Tier-based template access
  - Responsive design

### 2. Template System
- **Component**: `CVTemplateSelector.tsx`
- **Features**:
  - Scrollable template gallery
  - Template preview with sample data
  - Tier-based access control
  - Color and font customization

### 3. Live Preview
- **Component**: `CVTemplatePreview.tsx`
- **Features**:
  - Real-time preview updates
  - Sample data toggle
  - Responsive design
  - Export to PDF

### 4. Authentication System
- **Components**: 
  - `AuthForm.tsx`
  - `AuthCallback.tsx`
  - `ProtectedRoute.tsx`
- **Features**:
  - Supabase authentication
  - Social login (Google, LinkedIn)
  - Protected routes
  - Session management

### 5. Dashboard
- **Component**: `Dashboard.tsx`
- **Features**:
  - CV management
  - Job applications tracking
  - Analytics overview
  - Quick actions

---

## API Endpoints

### Authentication Endpoints
```typescript
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/logout
// GET /api/auth/user
// POST /api/auth/refresh
```

### CV Endpoints
```typescript
// GET /api/cvs - Get user's CVs
// POST /api/cvs - Create new CV
// GET /api/cvs/:id - Get specific CV
// PUT /api/cvs/:id - Update CV
// DELETE /api/cvs/:id - Delete CV
// POST /api/cvs/:id/analyze - AI analysis
```

### Job Application Endpoints
```typescript
// GET /api/applications - Get user's applications
// POST /api/applications - Create application
// PUT /api/applications/:id - Update application
// DELETE /api/applications/:id - Delete application
```

### AI Analysis Endpoints
```typescript
// POST /api/ai/tailor-cv - Tailor CV for job
// POST /api/ai/generate-cover-letter - Generate cover letter
// POST /api/ai/analyze-match - Analyze CV-job match
```

---

## Configuration Files

### Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### Tailwind Configuration (tailwind.config.cjs)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Setup Instructions

### 1. Clone and Setup Project
```bash
# Create project directory
mkdir cv-builder-project
cd cv-builder-project

# Initialize git
git init

# Create backend and frontend directories
mkdir backend frontend
```

### 2. Backend Setup
```bash
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install express cors dotenv multer mammoth pdf-parse @supabase/supabase-js uuid bcryptjs jsonwebtoken stripe openai helmet express-rate-limit compression

# Install dev dependencies
npm install -D nodemon jest supertest @types/express @types/node @types/cors @types/multer @types/bcryptjs @types/jsonwebtoken @types/uuid typescript

# Create TypeScript config
npx tsc --init

# Create environment file
echo "PORT=8080
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=your_jwt_secret_key
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads" > .env
```

### 3. Frontend Setup
```bash
cd ../frontend

# Create Vite React project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install react-router-dom @supabase/supabase-js @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate react-hook-form @hookform/resolvers zod stripe react-pdf html2canvas jspdf framer-motion react-hot-toast sonner nuqs

# Install dev dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser autoprefixer eslint eslint-plugin-react-hooks eslint-plugin-react-refresh postcss tailwindcss

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create environment file
echo "VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key" > .env
```

### 4. Database Setup
```bash
# Create Supabase project at https://supabase.com
# Run the schema.sql file in Supabase SQL editor
# Update environment variables with your Supabase credentials
```

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## Development Workflow

### 1. Code Organization
- **Components**: Modular, reusable components in `src/components/`
- **Pages**: Route-level components in `src/pages/`
- **Hooks**: Custom React hooks in `src/hooks/`
- **Utils**: Helper functions in `src/lib/`
- **Types**: TypeScript interfaces in `src/types/`

### 2. Styling Guidelines
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use Shadcn UI components for consistency
- Implement glassmorphism effects where appropriate

### 3. State Management
- Use React hooks for local state
- Use Supabase for server state
- Implement proper loading and error states
- Use React Query for caching (if needed)

### 4. Testing Strategy
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for critical UI elements
- E2E tests for user workflows

### 5. Deployment
- **Frontend**: Vercel, Netlify, or similar
- **Backend**: Railway, Heroku, or similar
- **Database**: Supabase (already configured)
- **Environment Variables**: Set in deployment platform

---

## Critical Files to Backup

### Core Components
- `src/components/cv-builder/CVBuilderStepper.tsx`
- `src/components/cv/CVTemplateSelector.tsx`
- `src/components/cv/CVTemplatePreview.tsx`
- `src/components/auth/AuthForm.tsx`
- `src/components/dashboard/Dashboard.tsx`

### Configuration Files
- `package.json` (both frontend and backend)
- `vite.config.ts`
- `tailwind.config.cjs`
- `tsconfig.json`
- `.env` files (template only, no actual keys)

### Data Files
- `src/data/cvTemplates.ts`
- `src/data/sampleCVData.ts`
- `supabase/schema.sql`

### Utility Files
- `src/lib/supabase.ts`
- `src/lib/auth.tsx`
- `src/lib/utils.ts`
- `src/hooks/useAuth.ts`

---

## Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate keys regularly
- Use different keys for development and production

### Authentication
- Implement proper JWT token management
- Use secure session handling
- Implement rate limiting
- Validate all user inputs

### File Uploads
- Validate file types and sizes
- Scan uploaded files for malware
- Store files securely
- Implement proper access controls

---

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize bundle size with code splitting
- Use proper image optimization

### Backend
- Implement caching strategies
- Use database indexing
- Optimize database queries
- Implement rate limiting

### Database
- Use proper indexes on frequently queried columns
- Implement connection pooling
- Monitor query performance
- Regular database maintenance

---

## Troubleshooting

### Common Issues
1. **Port conflicts**: Kill processes using ports 3000/8080
2. **Environment variables**: Ensure all .env files are properly configured
3. **Database connections**: Verify Supabase credentials
4. **CORS issues**: Check backend CORS configuration
5. **Build errors**: Clear node_modules and reinstall dependencies

### Debug Commands
```bash
# Kill processes on specific ports
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Conclusion

This backup guide contains everything needed to recreate the CV Builder project from scratch. Keep this document updated as the project evolves, and store it in a secure location separate from the main codebase.

**Last Updated**: [Current Date]
**Version**: 1.0.0
**Project Status**: Development Complete 