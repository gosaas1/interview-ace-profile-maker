# 🔧 APPLYACE - COMPREHENSIVE TECHNICAL REFERENCE v2.0

## 📅 Document Metadata

* **Version**: 2.0
* **Last Updated**: 2025-01-18
* **Source**: Updated per PRD v4.2 & Taskmaster v1.5
* **Status**: Production Ready with Enhanced Features

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

### **Architecture Pattern**

* **Frontend**: React 18 + TypeScript + Vite
* **Backend**: Node.js + Express + TypeScript
* **Database**: Supabase (PostgreSQL) with RLS & Triggers
* **Authentication**: Supabase Auth (OAuth: Google, LinkedIn)
* **Styling**: Tailwind CSS + Shadcn UI + Radix UI
* **State Management**: React Query + React Hook Form
* **AI Providers**: AWS Textract, Cohere, Claude (Haiku/Sonnet)
* **Cost Dashboard**: Internal admin panel for API usage & cost monitoring
* **Testing**: Playwright E2E + Jest Unit Tests

### **Deployment Architecture**

```
Frontend (3000) <── HTTPS ──> Backend (8000) <── Supabase (Cloud)──> AI APIs
```

---

## 📦 FRAMEWORKS & LIBRARIES

### **Frontend**

```json
{
  "react": "^18.2.0",
  "vite": "^5.x",
  "shadcn/ui": "^1.x",
  "tailwindcss": "^3.x",
  "framer-motion": "^12.x",
  "playwright": "^1.40.0",
  "nuqs": "^1.0.0"
}
```

### **Backend**

```json
{
  "express": "^4.18.0",
  "@supabase/supabase-js": "^2.38.0",
  "aws-sdk": "^2.1360.0",
  "cohere": "^2.x",
  "anthropic": "^0.3.x",
  "joi": "^17.x",
  "playwright": "^1.40.0"
}
```

---

## 🗄️ DATABASE SCHEMA (SUPABASE)

### **Core Tables**

#### **cvs**
* **parse_method**: `textract|cohere` stored per upload
* **parsed_text**: JSONB
* **parse_cost**: NUMERIC
* **parse_time**: TIMESTAMP
* **usage_count** tracked separately

#### **ai_usage**
```sql
CREATE TABLE public.ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  provider text NOT NULL,
  operation text NOT NULL,
  tokens_used integer,
  cost numeric,
  created_at timestamp with time zone DEFAULT now()
);
```

### **Enhanced Tables (v2.0)**

#### **usage_history**
```sql
CREATE TABLE public.usage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  feature_type text NOT NULL CHECK (feature_type IN ('cv_parse', 'ai_rewrite', 'job_apply', 'interview_practice')),
  tokens_consumed integer DEFAULT 0,
  cost_incurred numeric(10,4) DEFAULT 0,
  tier_used text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);
```

#### **parsing_logs**
```sql
CREATE TABLE public.parsing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  cv_id uuid REFERENCES public.cvs(id),
  parse_method text NOT NULL CHECK (parse_method IN ('textract', 'cohere', 'fallback')),
  file_size_bytes integer,
  parse_duration_ms integer,
  success boolean NOT NULL,
  error_message text,
  tokens_used integer DEFAULT 0,
  cost_incurred numeric(10,4) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
```

#### **tier_history**
```sql
CREATE TABLE public.tier_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  old_tier text,
  new_tier text NOT NULL,
  change_reason text NOT NULL CHECK (change_reason IN ('upgrade', 'downgrade', 'admin_change', 'trial_expiry')),
  changed_by text NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now()
);
```

#### **tier_limits**
```sql
CREATE TABLE public.tier_limits (
  tier_name text PRIMARY KEY,
  cv_parses_per_month integer NOT NULL,
  ai_rewrites_per_month integer NOT NULL,
  job_applications_per_month integer NOT NULL,
  interview_sessions_per_month integer NOT NULL,
  max_tokens_per_request integer NOT NULL,
  cost_per_token numeric(10,6) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### **Enhanced Profiles Table**
```sql
ALTER TABLE public.profiles ADD COLUMN current_tier text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN tier_start_date timestamp with time zone DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN monthly_usage_reset_date timestamp with time zone DEFAULT now();
```

---

## 🔄 DATA FLOW ARCHITECTURE

### **CV Parsing Flow**

1. Upload CV (PDF/DOCX/TXT)
2. **AWS Textract**: extractTextFromTextract()
3. **Fallback**: extractTextFromCohere() if Textract fails
4. Compute & log cost in `ai_usage` + `parsing_logs`
5. Store hash + parsed_text in `cvs`
6. Update `usage_history` with tier consumption

### **AI Analysis Flow**

1. User requests CV review or cover letter
2. Check tier limits via `get_user_tier_info()`
3. **Cohere** for rewrite
4. **Claude** for double-check (Career Pro+) or interview Qs
5. Log tokens & cost in `ai_usage` + `usage_history`
6. Return results via `/api/cv/analyze` etc.

### **Job Application Flow**

1. User inputs job description/URL
2. Validate tier permissions via `can_perform_action()`
3. Generate cover letter with AI
4. Track application in `usage_history`
5. Provide real-time progress updates

### **Interview Practice Flow**

1. Start interview session
2. Voice input processing
3. AI coaching tips generation
4. Session summary and feedback
5. Usage tracking and tier validation

---

## 🚀 API ENDPOINTS

### **CV Management**

```
POST   /api/cv/parse        # Parse via Textract+Fallback
POST   /api/cv/create       # Save new CV
GET    /api/cv/:id          # Fetch CV + parse metadata
GET    /api/cv/history      # List CVs
PUT    /api/cv/:id          # Update CV
DELETE /api/cv/:id          # Delete CV
```

### **Job Management**

```
POST   /api/job/save        # Save JD
GET    /api/job/list        # List jobs
POST   /api/job/:id/apply   # Mark applied (One-Click Apply)
GET    /api/job/:id/status  # Application status
```

### **Interview Coach**

```
POST   /api/interview/start     # Start interview session
POST   /api/interview/save      # Save Q&A session
GET    /api/interview/:jobId    # Fetch Q&A
POST   /api/interview/voice     # Process voice input
GET    /api/interview/summary   # Session summary
```

### **Analytics & Admin**

```
GET    /api/analytics/usage     # User usage stats
GET    /api/admin/usage         # Global API usage
GET    /api/admin/costs         # Cost dashboard
GET    /api/admin/alerts        # Tier breaches
GET    /api/admin/parsing-stats # Parsing performance
POST   /api/feedback            # User feedback
POST   /api/contact             # Public contact messages
```

### **Tier Management**

```
GET    /api/tier/info           # User tier information
GET    /api/tier/limits         # Tier limits
POST   /api/tier/upgrade        # Upgrade tier
GET    /api/tier/history        # Tier change history
```

---

## 🔧 CORE LIBRARIES & UTILITIES

### **AI Provider Manager** (`src/lib/ai-provider-manager.ts`)

* Tier-based routing
* Cost & token tracking
* Fallback orchestration

### **Parsing Utilities**

* `aws-textract.ts`
* `cohere-parser.ts`

### **Tier Management** (`src/lib/tier-manager.ts`)

* `get_user_tier_info(user_id)`
* `can_perform_action(user_id, action_type)`
* `update_usage_history(user_id, feature_type, tokens, cost)`

### **Cost Guard Panel**

* Admin API + frontend dashboard
* Tracks: parsing, AI requests, affiliate payouts
* Real-time alerts for tier breaches

---

## 🧪 TESTING STRATEGY

### **E2E Test Suites**

#### **Parsing Flow Tests** (`backend/tests/e2e/parsing-flow.test.js`)
- File upload validation
- Textract vs Cohere fallback
- Error handling and retry logic
- Tier limit enforcement
- Performance metrics tracking

#### **AI Rewrite Flow Tests** (`backend/tests/e2e/ai-rewrite-flow.test.js`)
- Success scenarios with different CV types
- Tier restrictions and upgrade prompts
- Error handling and suggestions
- Concurrency testing
- Cost tracking validation

#### **Job Apply Flow Tests** (`backend/tests/e2e/job-apply-flow.test.js`)
- One-click application process
- Cover letter generation
- Tier limit enforcement
- Application tracking
- Bulk application scenarios

#### **Interview Flow Tests** (`backend/tests/e2e/interview-flow.test.js`)
- Session initialization
- Voice input processing
- Coaching tips generation
- Session summary creation
- Tier limit validation

### **Test Automation**

* **Backend**: Jest + Supertest
* **Frontend**: Jest + RTL + Playwright
* **E2E**: Playwright with real browser testing
* **Mocking**: AWS Textract & Cohere mocks

---

## 📱 FRONTEND COMPONENTS (Enhanced v2.0)

```
src/components/
├── cv/             # CVBuilderPage.tsx, CVPreviewModal.tsx
├── jobs/           # JobApplyPage.tsx, JobList.tsx, OneClickApplyPage.tsx
├── interview/      # InterviewCoach.tsx, InterviewCoachPage.tsx
├── dashboard/      # UsageDashboard.tsx, AdminPanel.tsx
├── tier/           # TierUpgradeModal.tsx, UsageStats.tsx
└── ui/             # Shadcn UI wrapper components
```

### **New Pages (v2.0)**

#### **OneClickApplyPage.tsx**
- Job description/URL input
- Stepwise application process
- Cost estimation and tier gating
- Real-time progress tracking
- Application status monitoring

#### **InterviewCoachPage.tsx**
- Voice input processing
- AI coaching integration
- Session management
- Progress tracking
- Tier-based feature access

#### **Enhanced Admin Dashboard**
- Usage charts and analytics
- Real-time alerts for tier breaches
- Parsing performance metrics
- Cost tracking and optimization

---

## 🔐 AUTHENTICATION & SECURITY

* `authenticateUser` middleware for protected routes
* RLS policies on all tables with user isolation
* Tier-based access control
* Optional auth on `/api/feedback`
* Secure token handling for AI providers

---

## ⚙️ ENVIRONMENT VARIABLES

### **Backend `.env`**

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
COHERE_API_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
NODE_ENV=development
PORT=8000
```

### **Frontend `.env.local`**

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=...
VITE_APP_ENV=development
```

---

## 🚀 DEPLOYMENT & MIGRATION

### **Database Migrations**

#### **Migration Runner** (`backend/scripts/run-migrations.js`)
- Sequential migration execution
- Error handling and rollback
- Environment-specific configurations

#### **Migration Files**
- `001_usage_history.sql`: Usage tracking with RLS
- `002_parsing_logs.sql`: Parsing performance metrics
- `003_user_tier_lookup.sql`: Tier management system

### **E2E Test Runner** (`backend/tests/run-e2e-tests.js`)
- Environment setup and teardown
- Parallel test execution
- Comprehensive reporting
- Test data cleanup

---

## 📊 MONITORING & ANALYTICS

### **Usage Tracking**
- Real-time user activity monitoring
- Tier consumption analytics
- Cost optimization insights
- Performance metrics

### **Admin Dashboard**
- Global usage statistics
- Cost breakdown by feature
- Tier upgrade conversion rates
- System health monitoring

---

## 🎯 VERSION HISTORY

* **v2.0**: Enhanced with comprehensive E2E tests, tier management, usage tracking, and new frontend pages
* **v1.5**: Added database migrations and enhanced API endpoints
* **v1.0**: Initial technical reference

---

## 🔄 DEVELOPMENT WORKFLOW

### **Database Changes**
1. Create migration file in `backend/migrations/`
2. Run migrations: `node backend/scripts/run-migrations.js`
3. Update schema documentation
4. Test with E2E suites

### **Feature Development**
1. Implement backend API endpoints
2. Create frontend components
3. Write E2E tests
4. Update documentation
5. Run full test suite

### **Testing Pipeline**
1. Unit tests for individual components
2. Integration tests for API endpoints
3. E2E tests for complete user flows
4. Performance and load testing

*End of Document* 
 
 