# API Contracts Documentation
## Total Frontend-Backend Linking Guide

This document ensures complete alignment between frontend and backend APIs, data structures, and contracts for the ApplyAce application.

---

## 🏗️ Architecture Overview

- **Frontend**: React + TypeScript (Port 3000)
- **Backend**: Express.js (Port 8080)
- **Database**: Supabase (PostgreSQL)
- **Shared Contracts**: `src/lib/api-contracts.ts`

---

## 🔗 API Endpoints

### Base URLs
```typescript
const API_ENDPOINTS = {
  BACKEND_BASE: 'http://localhost:8080',
  FRONTEND_BASE: 'http://localhost:3000',
  // ... other endpoints
}
```

### 1. Job Scraping API

**Endpoint**: `POST /api/jobs/scrape-job`

**Request**:
```typescript
interface JobScrapingRequest {
  jobUrl: string;
}
```

**Response**:
```typescript
interface JobScrapingResponse {
  success: boolean;
  data: JobPosting;
  ai_enhanced: boolean;
  job_board: string;
  note?: string;
  error?: string;
}
```

**JobPosting Interface**:
```typescript
interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  keywords: string[];
  salary_range?: string;
  application_url: string;
  posted_date: string;
  job_board?: string;
  // Enhanced fields from AI analysis
  ai_enhanced?: boolean;
  skill_categories?: {
    technical?: string[];
    soft_skills?: string[];
    tools?: string[];
    methodologies?: string[];
  };
  experience_level_analysis?: 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  industry_focus?: string;
  remote_work_compatibility?: 'remote' | 'hybrid' | 'on-site';
  salary_insights?: string;
  application_tips?: string;
  // Additional fields
  employment_type?: string;
  experience_level?: string;
  company_size?: string;
  industry?: string;
  benefits?: string[];
}
```

### 2. AI CV Tailoring API

**Endpoint**: `POST /api/ai/tailor-cv`

**Request**:
```typescript
interface AITailoringRequest {
  cvData: CVData;
  jobData: JobPosting;
  action: 'tailor-cv' | 'generate-cover-letter' | 'analyze-match';
}
```

**Response**:
```typescript
interface AITailoringResponse {
  success: boolean;
  action: string;
  data: TailoredCVResult | CoverLetterResult | MatchAnalysis;
  note?: string;
  error?: string;
}
```

**Action-Specific Responses**:

#### Analyze Match Response
```typescript
interface MatchAnalysis {
  overall_match_score: number;
  skills_match: {
    score: number;
    matching_skills: string[];
    missing_skills: string[];
  };
  strengths: string[];
  recommendations: string[];
  interview_probability: number;
  ai_powered: boolean;
}
```

#### Tailor CV Response
```typescript
interface TailoredCVResult {
  tailored_cv: CVData;
  optimization_notes: {
    match_score: number;
    improvements_made: string[];
    ai_powered: boolean;
    compliance_score?: number;
    compliance_issues?: string[];
    compliance_suggestions?: string[];
  };
}
```

#### Cover Letter Response
```typescript
interface CoverLetterResult {
  cover_letter: string;
  ai_powered: boolean;
  customization_notes: string[];
}
```

### 3. CV Data Structure

**Core CV Interface**:
```typescript
interface CVData {
  id: string;
  user_id: string;
  full_name: string;
  job_title: string;
  email: string;
  phone?: string;
  location: string;
  linkedin_url?: string;
  portfolio_url?: string;
  summary: string;
  experiences: WorkExperience[];
  education: Education[];
  projects?: Project[];
  skills: string;
  languages?: Language[];
  certifications?: string;
  references?: Reference[];
  template_id?: string;
  is_primary?: boolean;
  ats_score?: number;
  content_type?: 'manual' | 'uploaded' | 'ai_generated';
  created_at?: string;
  updated_at?: string;
  industry?: string;
  target_role?: string;
  keywords?: string[];
  // Fallback fields for compatibility
  base_experiences?: WorkExperience[];
}
```

**Supporting Interfaces**:
```typescript
interface WorkExperience {
  id?: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
  location?: string;
  description?: string;
}

interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

interface Language {
  id?: string;
  language: string;
  proficiency: string;
}

interface Reference {
  id?: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}
```

---

## 🔄 Data Flow Examples

### 1. One-Button Apply Flow

```typescript
// 1. User enters job URL
const jobUrl = "https://linkedin.com/jobs/view/123456";

// 2. Frontend calls job scraping API
const jobResponse = await fetch(`${API_ENDPOINTS.BACKEND_BASE}${API_ENDPOINTS.SCRAPE_JOB}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jobUrl })
});

const jobData: JobScrapingResponse = await jobResponse.json();
const jobPosting: JobPosting = jobData.data;

// 3. Frontend calls AI analysis
const analysisResponse = await fetch(`${API_ENDPOINTS.BACKEND_BASE}${API_ENDPOINTS.AI_TAILOR_CV}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cvData: userCV,
    jobData: jobPosting,
    action: 'analyze-match'
  })
});

const analysisData: AITailoringResponse = await analysisResponse.json();
const matchAnalysis: MatchAnalysis = analysisData.data as MatchAnalysis;

// 4. Frontend calls CV tailoring
const tailoringResponse = await fetch(`${API_ENDPOINTS.BACKEND_BASE}${API_ENDPOINTS.AI_TAILOR_CV}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cvData: userCV,
    jobData: jobPosting,
    action: 'tailor-cv'
  })
});

const tailoringData: AITailoringResponse = await tailoringResponse.json();
const tailoredResult: TailoredCVResult = tailoringData.data as TailoredCVResult;
const tailoredCV: CVData = tailoredResult.tailored_cv;
```

### 2. Error Handling

```typescript
// Consistent error response structure
interface APIError {
  error: string;
  message?: string;
  details?: any;
  status?: number;
}

// Frontend error handling
try {
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    const errorData: APIError = await response.json();
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API call failed:', error);
  // Handle error appropriately
}
```

---

## 🛡️ Validation Schemas

### Job Posting Validation
```typescript
const JOB_POSTING_VALIDATION = {
  required: ['id', 'title', 'company', 'location', 'description', 'requirements', 'keywords', 'application_url', 'posted_date'],
  optional: ['salary_range', 'job_board', 'ai_enhanced', 'skill_categories', 'experience_level_analysis', 'industry_focus', 'remote_work_compatibility', 'salary_insights', 'application_tips', 'employment_type', 'experience_level', 'company_size', 'industry', 'benefits']
} as const;
```

### CV Data Validation
```typescript
const CV_DATA_VALIDATION = {
  required: ['id', 'user_id', 'full_name', 'job_title', 'email', 'location', 'summary', 'experiences', 'education', 'skills'],
  optional: ['phone', 'linkedin_url', 'portfolio_url', 'projects', 'languages', 'certifications', 'references', 'template_id', 'is_primary', 'ats_score', 'content_type', 'created_at', 'updated_at', 'industry', 'target_role', 'keywords', 'base_experiences']
} as const;
```

---

## 🔧 Implementation Guidelines

### 1. Type Safety
- Always use shared interfaces from `api-contracts.ts`
- Never create duplicate type definitions
- Use TypeScript strict mode for all API calls

### 2. Error Handling
- Consistent error response format across all endpoints
- Proper HTTP status codes
- Detailed error messages for debugging

### 3. Data Validation
- Validate all required fields on both frontend and backend
- Use shared validation schemas
- Provide meaningful error messages for validation failures

### 4. API Versioning
- All endpoints are version 1 (v1)
- Future changes will be versioned as `/api/v2/...`
- Maintain backward compatibility within major versions

### 5. CORS Configuration
```typescript
// Backend CORS setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 🧪 Testing Contracts

### Frontend Testing
```typescript
// Test API contract compliance
import { JobPosting, CVData, API_ENDPOINTS } from '@/lib/api-contracts';

describe('API Contracts', () => {
  test('Job scraping returns valid JobPosting', async () => {
    const response = await fetch(`${API_ENDPOINTS.BACKEND_BASE}${API_ENDPOINTS.SCRAPE_JOB}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobUrl: 'https://linkedin.com/jobs/view/123' })
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      company: expect.any(String),
      // ... other required fields
    });
  });
});
```

### Backend Testing
```typescript
// Test endpoint contract compliance
describe('Job Scraping API', () => {
  test('returns valid JobScrapingResponse', async () => {
    const response = await request(app)
      .post('/api/jobs/scrape-job')
      .send({ jobUrl: 'https://linkedin.com/jobs/view/123' });
    
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        // ... other required fields
      })
    });
  });
});
```

---

## 📋 Checklist for Total Linking

- [x] Shared type definitions in `api-contracts.ts`
- [x] Consistent API endpoint structure
- [x] Proper error handling and status codes
- [x] Data validation schemas
- [x] CORS configuration
- [x] TypeScript strict mode enforcement
- [x] Frontend-backend port configuration
- [x] Mock data alignment with contracts
- [x] API documentation
- [x] Testing contracts

---

## 🚀 Next Steps

1. **Real AI Integration**: Replace mock data with actual OpenAI API calls
2. **Job Scraping**: Implement real web scraping with Puppeteer/Playwright
3. **Database Integration**: Connect AI results to Supabase
4. **Performance Optimization**: Add caching and rate limiting
5. **Monitoring**: Add API usage analytics and error tracking

---

*This documentation ensures total linking between frontend and backend, preventing type mismatches, API contract violations, and data structure inconsistencies.* 