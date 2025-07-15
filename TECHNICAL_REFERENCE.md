# 🔧 APPLYACE - COMPREHENSIVE TECHNICAL REFERENCE

## 📋 **Document Information**
- **Project Name**: ApplyAce - The Complete Career Success Platform
- **Version**: 1.0.0
- **Last Updated**: January 2025
- **Status**: Active Development

---

## 🏗️ **SYSTEM ARCHITECTURE OVERVIEW**

### **Architecture Pattern**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **State Management**: React Query + React Hook Form
- **Payment Processing**: Stripe

### **Deployment Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Port 3000)   │◄──►│   (Port 8000)   │◄──►│   (Supabase)    │
│   React + Vite  │    │   Express       │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📦 **FRAMEWORKS & LIBRARIES**

### **Frontend Dependencies**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^5.4.19",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "tailwindcss": "^3.3.0",
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^2.0.0",
  "framer-motion": "^10.16.0",
  "react-router-dom": "^6.8.0",
  "react-hook-form": "^7.43.0",
  "sonner": "^1.0.0",
  "lucide-react": "^0.263.0",
  "clsx": "^2.0.0",
  "class-variance-authority": "^0.7.0"
}
```

### **Backend Dependencies**
```json
{
  "express": "^4.18.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "multer": "^1.4.5",
  "@supabase/supabase-js": "^2.38.0",
  "pdf-parse": "^1.1.1",
  "mammoth": "^1.6.0",
  "uuid": "^9.0.0",
  "joi": "^17.9.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0"
}
```

---

## 🗄️ **DATABASE SCHEMA (SUPABASE)**

### **CVs Table Structure**
```sql
CREATE TABLE public.cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT false,
    template_id TEXT DEFAULT 'basic-modern',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### **Content JSONB Structure**
```typescript
interface CVContent {
  full_name: string;
  job_title?: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url?: string;
  portfolio_url?: string;
  summary: string;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
    url: string;
  }>;
  skills: string;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: string;
  references?: Array<{
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }>;
}
```

---

## 🔄 **DATA FLOW ARCHITECTURE**

### **CV Builder Flow**
```
1. User Input (CVBuilderPage.tsx)
   ↓
2. State Management (cvData: CVData)
   ↓
3. Live Preview (CVPreview.tsx)
   ↓
4. Save to Database (cvOperations.createCV)
   ↓
5. Backend API (/api/cv/create)
   ↓
6. Supabase Database (cvs table)
```

### **CV Load/View Flow**
```
1. Database Query (cvOperations.getCV)
   ↓
2. Backend API (/api/cv/:id)
   ↓
3. Data Mapping (mapBackendContentToCVData)
   ↓
4. Frontend State (cvData)
   ↓
5. Preview/Print (CVPreviewModal.tsx)
```

### **File Upload Flow**
```
1. File Selection (CVUploadFlow.tsx)
   ↓
2. File Processing (pdf-parse/mammoth)
   ↓
3. Text Extraction & Parsing
   ↓
4. Data Mapping (parseCVData)
   ↓
5. Database Storage (cvs table)
   ↓
6. Preview/Edit (CVBuilderPage.tsx)
```

---

## 🎨 **UI COMPONENT ARCHITECTURE**

### **Core Components**
```
src/components/
├── cv/
│   ├── CVBuilderPage.tsx          # Main CV builder interface
│   ├── CVPreviewModal.tsx         # CV preview and print modal
│   ├── CVUploadFlow.tsx           # File upload and processing
│   ├── CVForm.tsx                 # CV data entry forms
│   └── CVTemplateSelector.tsx     # Template selection interface
├── cv-builder/
│   ├── CVPreview.tsx              # Live CV preview component
│   └── CVTemplateSelector.tsx     # Template selection
├── ui/                            # Shadcn UI components
└── auth/                          # Authentication components
```

### **Key Data Interfaces**
```typescript
// Frontend CV Data Structure
interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    website: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    gpa: string;
  }>;
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
}
```

---

## 🔧 **CRITICAL MAPPING FUNCTIONS**

### **Frontend ↔ Backend Data Mapping**
```typescript
// Map frontend CVData to backend content
function mapCVDataToBackendContent(cvData: CVData) {
  return {
    full_name: cvData.personalInfo.fullName,
    email: cvData.personalInfo.email,
    phone: cvData.personalInfo.phone,
    location: cvData.personalInfo.location,
    linkedin_url: cvData.personalInfo.linkedIn,
    portfolio_url: cvData.personalInfo.website,
    summary: cvData.personalInfo.summary,
    experiences: cvData.experience.map(exp => ({
      company: exp.company,
      role: exp.position,
      duration: `${exp.startDate} - ${exp.endDate}`,
      description: exp.description
    })),
    education: cvData.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      year: `${edu.startYear} - ${edu.endYear}`,
      gpa: edu.gpa
    })),
    skills: cvData.skills.join(', '),
    certifications: cvData.certifications.map(cert => 
      `${cert.name} (${cert.issuer})`
    ).join(', ')
  };
}

// Map backend content to frontend CVData
function mapBackendContentToCVData(content: any): CVData {
  return {
    personalInfo: {
      fullName: content.full_name || '',
      email: content.email || '',
      phone: content.phone || '',
      location: content.location || '',
      linkedIn: content.linkedin_url || '',
      website: content.portfolio_url || '',
      summary: content.summary || ''
    },
    experience: (content.experiences || []).map((exp: any) => ({
      company: exp.company || '',
      position: exp.role || '',
      startDate: exp.duration?.split(' - ')[0] || '',
      endDate: exp.duration?.split(' - ')[1] || '',
      description: exp.description || ''
    })),
    education: (content.education || []).map((edu: any) => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: '',
      startYear: edu.year?.split(' - ')[0] || '',
      endYear: edu.year?.split(' - ')[1] || '',
      gpa: edu.gpa || ''
    })),
    skills: Array.isArray(content.skills) ? content.skills : 
            typeof content.skills === 'string' ? content.skills.split(',').map(s => s.trim()) : [],
    certifications: (content.certifications || '').split(',').map(cert => ({
      name: cert.trim(),
      issuer: '',
      date: '',
      expiryDate: undefined
    }))
  };
}
```

---

## 🚀 **API ENDPOINTS**

### **Backend Routes**
```
POST /api/cv/create          # Create new CV from builder
POST /api/cv/upload          # Upload and process CV file
GET  /api/cv/:id             # Get CV by ID
PUT  /api/cv/:id             # Update CV
DELETE /api/cv/:id           # Delete CV
GET  /api/cv                 # List user's CVs
```

### **Frontend API Operations**
```typescript
// CV Operations (src/lib/supabase.ts)
export const cvOperations = {
  async createCV(userId: string, cvData: { title: string; content: any; is_public?: boolean; template_id?: string }),
  async getCV(id: string),
  async updateCV(id: string, updates: any),
  async deleteCV(id: string),
  async listCVs(userId: string)
};
```

---

## 🔐 **AUTHENTICATION & SECURITY**

### **Supabase Auth Integration**
- **Provider**: Supabase Auth
- **Methods**: Email/Password, OAuth (Google, LinkedIn)
- **Session Management**: Automatic token refresh
- **Row Level Security**: Enabled on all tables

### **Security Policies**
```sql
-- CV access policies
CREATE POLICY "Users can view own CVs" ON public.cvs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CVs" ON public.cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs" ON public.cvs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs" ON public.cvs
    FOR DELETE USING (auth.uid() = user_id);
```

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints**
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

### **Mobile-First Approach**
- **CV Builder**: Single column on mobile, two-column on desktop
- **Template Selector**: Horizontal scroll on mobile, grid on desktop
- **Preview**: Modal overlay on mobile, side-by-side on desktop

---

## 🎯 **PERFORMANCE OPTIMIZATION**

### **Frontend Optimizations**
- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: WebP format, lazy loading
- **Bundle Optimization**: Tree shaking, minification
- **Caching**: React Query for API response caching

### **Backend Optimizations**
- **Database Indexing**: GIN indexes on JSONB columns
- **Connection Pooling**: Supabase connection management
- **File Processing**: Stream-based PDF/DOCX parsing
- **Error Handling**: Comprehensive error boundaries

---

## 🧪 **TESTING STRATEGY**

### **Frontend Testing**
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Storybook for UI components
- **E2E Tests**: Playwright for critical user flows

### **Backend Testing**
- **API Tests**: Supertest for endpoint testing
- **Database Tests**: Integration tests with test database
- **File Processing Tests**: Mock file uploads

---

## 🚀 **DEPLOYMENT**

### **Environment Variables**
```env
# Frontend (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000

# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=8000
NODE_ENV=development
```

### **Build Commands**
```bash
# Frontend
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build

# Backend
npm run server       # Development server (port 8000)
npm run build        # TypeScript compilation
npm start           # Production server
```

---

## 🔍 **DEBUGGING & TROUBLESHOOTING**

### **Common Issues**
1. **Port Conflicts**: Kill processes on ports 3000/8000
2. **Schema Cache**: Refresh Supabase schema cache
3. **Data Mapping**: Verify field names match exactly
4. **Authentication**: Check Supabase auth configuration

### **Debug Tools**
- **Frontend**: React DevTools, Vite HMR
- **Backend**: Express debug, Supabase dashboard
- **Database**: Supabase SQL editor, pgAdmin

---

## 📚 **KEY FILES & LOCATIONS**

### **Critical Frontend Files**
```
frontend/src/
├── pages/CVBuilderPage.tsx        # Main CV builder
├── components/cv/CVPreviewModal.tsx # CV preview/print
├── components/cv-builder/CVPreview.tsx # Live preview
├── lib/cv/types.ts               # TypeScript interfaces
├── lib/supabase.ts               # Database operations
└── data/cvTemplates.ts           # Template definitions
```

### **Critical Backend Files**
```
backend/
├── server.js                     # Main server file
├── src/routes/cv.ts             # CV API endpoints
├── src/lib/supabase.ts          # Database client
└── database-setup.sql           # Schema definitions
```

---

## 🎯 **DEVELOPMENT GUIDELINES**

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Git Hooks**: Pre-commit linting

### **Naming Conventions**
- **Components**: PascalCase (CVBuilderPage)
- **Files**: kebab-case (cv-builder.tsx)
- **Functions**: camelCase (mapCVData)
- **Constants**: UPPER_SNAKE_CASE (MAX_FILE_SIZE)

### **Error Handling**
- **Frontend**: React Error Boundaries
- **Backend**: Express error middleware
- **Database**: Supabase error handling
- **Validation**: Joi schema validation

---

## CV Template Selector & Data Discrepancy Audit (2025-01)

### Issues Identified:
- **Template Filtering:** Only templates with a `tier` matching the selected tab (case-sensitive, lowercase) are shown. Any mismatch in `tier` value or case will exclude templates.
- **Data Export:** All templates must be included in the exported `cvTemplates` array. Missing templates will not appear in the selector.
- **Duplicate State/Component Declarations:** Previous errors for `selectedTier` and `CVPreview` indicate duplicate declarations in some files. Only one declaration per component/file is allowed.
- **Object Literal Duplicates:** Warnings for duplicate keys (e.g., `education`, `skills`, `certifications`) in mapping code or template objects. These must be unique.
- **Import Errors:** Missing CSS file (`CVPreviewModal.print.css`) import causes build errors. All imports must exist or be removed if not needed.
- **Hot Reload/Cache:** Vite sometimes does not pick up changes to static data or deeply nested imports. Always restart the dev server after changes.

### Required Fixes:
- Audit all template objects for correct, lowercase `tier` and inclusion in export.
- Remove all duplicate state/component declarations in all related files.
- Clean up duplicate keys in object literals.
- Resolve all import errors and missing files.
- Document all findings and fixes in PRD and technical docs.
- Systematically audit all mapping, data flow, and interface consistency across the app.

This technical reference serves as the single source of truth for all development, debugging, and system understanding in the ApplyAce project. 