# 🗄️ APPLYACE - DATABASE SCHEMA REFERENCE

## 📋 **Document Information**
- **Project Name**: ApplyAce - The Complete Career Success Platform
- **Database**: Supabase (PostgreSQL)
- **Version**: 1.0.0
- **Last Updated**: January 2025
- **Status**: Production Ready

---

## 🎯 **SCHEMA PURPOSE**

This document provides the **exact field names, data types, and relationships** for all database tables in the ApplyAce platform. It serves as the **single source of truth** for:

- **Frontend Development**: Exact field names for forms and data display
- **Backend Development**: API field mapping and validation
- **Data Migration**: Schema changes and field updates
- **Error Prevention**: Eliminates field name mismatches

---

## 🏗️ **DATABASE ARCHITECTURE**

### **Database Provider**
- **Platform**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (planned)

### **Connection Details**
- **Host**: Supabase managed
- **Port**: 5432 (PostgreSQL default)
- **SSL**: Required
- **Connection Pooling**: Managed by Supabase

---

## 📊 **CORE TABLES SCHEMA**

### **1. PROFILES TABLE**
**Purpose**: User profile information linked to Supabase Auth

```sql
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### **Field Details**
| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `id` | `uuid` | ✅ | - | Primary key, references auth.users |
| `full_name` | `text` | ❌ | `null` | User's full name |
| `avatar_url` | `text` | ❌ | `null` | Profile picture URL |
| `created_at` | `timestamp with time zone` | ✅ | `now()` | Record creation timestamp |
| `updated_at` | `timestamp with time zone` | ✅ | `now()` | Record update timestamp |

#### **Frontend Mapping**
```typescript
interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
```

---

### **2. CVS TABLE (MAIN APPLICATION TABLE)**
**Purpose**: Core CV/resume data storage

```sql
CREATE TABLE public.cvs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  full_name text,
  job_title text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  portfolio_url text,
  website text,
  summary text,
  experiences jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  skills jsonb DEFAULT '[]',
  projects jsonb DEFAULT '[]',
  languages jsonb DEFAULT '[]',
  references jsonb DEFAULT '[]',
  certifications text,
  template_id text DEFAULT 'modern',
  is_public boolean DEFAULT false,
  is_primary boolean DEFAULT false,
  ats_score integer DEFAULT 0,
  file_url text,
  file_name text,
  file_size integer,
  content_type text DEFAULT 'manual',
  content jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### **Field Details**
| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `id` | `uuid` | ✅ | `uuid_generate_v4()` | Primary key |
| `user_id` | `uuid` | ✅ | - | Foreign key to auth.users |
| `title` | `text` | ✅ | - | CV title/name |
| `full_name` | `text` | ❌ | `null` | Person's full name |
| `job_title` | `text` | ❌ | `null` | Current/desired job title |
| `email` | `text` | ❌ | `null` | Contact email |
| `phone` | `text` | ❌ | `null` | Contact phone |
| `location` | `text` | ❌ | `null` | City/country location |
| `linkedin_url` | `text` | ❌ | `null` | LinkedIn profile URL |
| `portfolio_url` | `text` | ❌ | `null` | Portfolio website URL |
| `website` | `text` | ❌ | `null` | Personal website URL |
| `summary` | `text` | ❌ | `null` | Professional summary |
| `experiences` | `jsonb` | ❌ | `'[]'` | Work experience array |
| `education` | `jsonb` | ❌ | `'[]'` | Education history array |
| `skills` | `jsonb` | ❌ | `'[]'` | Skills array |
| `projects` | `jsonb` | ❌ | `'[]'` | Projects array |
| `languages` | `jsonb` | ❌ | `'[]'` | Languages array |
| `references` | `jsonb` | ❌ | `'[]'` | References array |
| `certifications` | `text` | ❌ | `null` | Certifications text |
| `template_id` | `text` | ❌ | `'modern'` | CV template identifier |
| `is_public` | `boolean` | ❌ | `false` | Public visibility flag |
| `is_primary` | `boolean` | ❌ | `false` | Primary CV flag |
| `ats_score` | `integer` | ❌ | `0` | ATS optimization score |
| `file_url` | `text` | ❌ | `null` | Uploaded file URL |
| `file_name` | `text` | ❌ | `null` | Original file name |
| `file_size` | `integer` | ❌ | `null` | File size in bytes |
| `content_type` | `text` | ❌ | `'manual'` | Content source type |
| `content` | `jsonb` | ❌ | `null` | Parsed content data |
| `created_at` | `timestamp with time zone` | ✅ | `now()` | Record creation timestamp |
| `updated_at` | `timestamp with time zone` | ✅ | `now()` | Record update timestamp |

#### **JSONB Structure Examples**

##### **Experiences Array**
```json
[
  {
    "id": "exp_1",
    "position": "Software Engineer",
    "company": "Tech Corp",
    "location": "London, UK",
    "start_date": "2023-01-01",
    "end_date": "2024-01-01",
    "current": false,
    "description": "Developed web applications using React and Node.js"
  }
]
```

##### **Education Array**
```json
[
  {
    "id": "edu_1",
    "institution": "University of London",
    "degree": "Bachelor of Science",
    "field": "Computer Science",
    "start_date": "2019-09-01",
    "end_date": "2023-06-01",
    "gpa": "3.8"
  }
]
```

##### **Skills Array**
```json
[
  "JavaScript",
  "React",
  "Node.js",
  "TypeScript",
  "PostgreSQL"
]
```

#### **Frontend Mapping**
```typescript
interface CVData {
  id?: string;
  user_id: string;
  title: string;
  full_name?: string;
  job_title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  website?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  languages: Language[];
  references: Reference[];
  certifications?: string;
  template_id: string;
  is_public: boolean;
  is_primary: boolean;
  ats_score: number;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  content_type: string;
  content?: any;
  created_at: string;
  updated_at: string;
}
```

---

### **3. INTERVIEW QUESTIONS TABLE**
**Purpose**: Store interview questions for practice

```sql
CREATE TABLE public.interview_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  category text NOT NULL,
  question text NOT NULL,
  difficulty text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### **Field Details**
| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `id` | `uuid` | ✅ | `uuid_generate_v4()` | Primary key |
| `category` | `text` | ✅ | - | Question category (e.g., "technical", "behavioral") |
| `question` | `text` | ✅ | - | The interview question |
| `difficulty` | `text` | ✅ | - | Difficulty level (e.g., "easy", "medium", "hard") |
| `created_at` | `timestamp with time zone` | ✅ | `now()` | Record creation timestamp |

---

### **4. INTERVIEW ANSWERS TABLE**
**Purpose**: Store user's interview practice answers

```sql
CREATE TABLE public.interview_answers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.interview_questions(id) ON DELETE CASCADE NOT NULL,
  answer text NOT NULL,
  feedback jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### **Field Details**
| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `id` | `uuid` | ✅ | `uuid_generate_v4()` | Primary key |
| `user_id` | `uuid` | ✅ | - | Foreign key to profiles |
| `question_id` | `uuid` | ✅ | - | Foreign key to interview_questions |
| `answer` | `text` | ✅ | - | User's answer |
| `feedback` | `jsonb` | ❌ | `null` | AI feedback on answer |
| `created_at` | `timestamp with time zone` | ✅ | `now()` | Record creation timestamp |

---

### **5. JOBS TABLE**
**Purpose**: Store job listings

```sql
CREATE TABLE public.jobs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  employer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### **Field Details**
| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `id` | `uuid` | ✅ | `uuid_generate_v4()` | Primary key |
| `employer_id` | `uuid` | ✅ | - | Foreign key to profiles (employer) |
| `title` | `text` | ✅ | - | Job title |
| `description` | `text` | ✅ | - | Job description |
| `requirements` | `text[]` | ✅ | - | Array of job requirements |
| `location` | `text` | ✅ | - | Job location |
| `type` | `text` | ✅ | - | Job type (full-time, part-time, etc.) |
| `status` | `text` | ✅ | `'active'` | Job status |
| `created_at` | `timestamp with time zone` | ✅ | `now()` | Record creation timestamp |
| `updated_at` | `timestamp with time zone` | ✅ | `now()` | Record update timestamp |

---

### **6. JOB APPLICATIONS TABLE**
**Purpose**: Track job applications

```sql
CREATE TABLE public.job_applications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id uuid REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  cover_letter text,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### **Field Details**
| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `id` | `uuid` | ✅ | `uuid_generate_v4()` | Primary key |
| `job_id` | `uuid` | ✅ | - | Foreign key to jobs |
| `user_id` | `uuid` | ✅ | - | Foreign key to profiles (applicant) |
| `cv_id` | `uuid` | ✅ | - | Foreign key to cvs |
| `cover_letter` | `text` | ❌ | `null` | Cover letter text |
| `status` | `text` | ✅ | `'pending'` | Application status |
| `created_at` | `timestamp with time zone` | ✅ | `now()` | Record creation timestamp |
| `updated_at` | `timestamp with time zone` | ✅ | `now()` | Record update timestamp |

---

## 🔗 **DATABASE RELATIONSHIPS**

### **Entity Relationship Diagram**
```
auth.users (1) ──── (1) profiles
     │
     │ (1)
     │
     └─── (many) cvs
              │
              │ (1)
              └─── (many) job_applications
                           │
                           │ (many)
                           └─── (1) jobs
                                    │
                                    │ (1)
                                    └─── (1) profiles (employer)

profiles (1) ──── (many) interview_answers
     │
     │ (many)
     └─── (1) interview_questions
```

### **Foreign Key Constraints**
- `profiles.id` → `auth.users.id`
- `cvs.user_id` → `auth.users.id`
- `interview_answers.user_id` → `profiles.id`
- `interview_answers.question_id` → `interview_questions.id`
- `jobs.employer_id` → `profiles.id`
- `job_applications.job_id` → `jobs.id`
- `job_applications.user_id` → `profiles.id`
- `job_applications.cv_id` → `cvs.id`

---

## 📊 **DATABASE INDEXES**

### **Performance Indexes**
```sql
-- CVs table indexes
CREATE INDEX cvs_user_id_idx ON public.cvs(user_id);
CREATE INDEX cvs_template_id_idx ON public.cvs(template_id);
CREATE INDEX cvs_created_at_idx ON public.cvs(created_at);

-- Interview answers indexes
CREATE INDEX interview_answers_user_id_idx ON public.interview_answers(user_id);

-- Jobs table indexes
CREATE INDEX jobs_employer_id_idx ON public.jobs(employer_id);

-- Job applications indexes
CREATE INDEX job_applications_job_id_idx ON public.job_applications(job_id);
CREATE INDEX job_applications_user_id_idx ON public.job_applications(user_id);
```

### **Index Usage**
- **User Queries**: `cvs_user_id_idx` for user-specific CVs
- **Template Queries**: `cvs_template_id_idx` for template filtering
- **Time-based Queries**: `cvs_created_at_idx` for recent CVs
- **Application Tracking**: `job_applications_user_id_idx` for user applications

---

## 🔐 **ROW LEVEL SECURITY (RLS)**

### **RLS Policies**

#### **Profiles Table**
```sql
-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### **CVs Table**
```sql
-- Users can view their own CVs
CREATE POLICY "Users can view their own CVs"
  ON public.cvs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own CVs
CREATE POLICY "Users can create their own CVs"
  ON public.cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own CVs
CREATE POLICY "Users can update their own CVs"
  ON public.cvs FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own CVs
CREATE POLICY "Users can delete their own CVs"
  ON public.cvs FOR DELETE
  USING (auth.uid() = user_id);

-- Public CVs are viewable by everyone
CREATE POLICY "Public CVs are viewable by everyone"
  ON public.cvs FOR SELECT
  USING (is_public = true);
```

#### **Interview Questions Table**
```sql
-- Anyone can view interview questions
CREATE POLICY "Anyone can view interview questions"
  ON public.interview_questions FOR SELECT
  USING (true);
```

#### **Interview Answers Table**
```sql
-- Users can view their own answers
CREATE POLICY "Users can view their own answers"
  ON public.interview_answers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own answers
CREATE POLICY "Users can create their own answers"
  ON public.interview_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### **Jobs Table**
```sql
-- Anyone can view active jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active');

-- Employers can create jobs
CREATE POLICY "Employers can create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

-- Employers can update their own jobs
CREATE POLICY "Employers can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = employer_id);
```

#### **Job Applications Table**
```sql
-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs"
  ON public.job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- Users can create applications
CREATE POLICY "Users can create applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🔄 **DATA MAPPING CONTRACTS**

### **Frontend ↔ Backend ↔ Database Mapping**

#### **CV Data Flow**
```
Frontend Form → Backend API → Database Storage
     ↓              ↓              ↓
CVData Interface → Express Route → Supabase Table
```

#### **Field Mapping Examples**

##### **Personal Information**
| Frontend Field | Backend Field | Database Field | Type |
|----------------|---------------|----------------|------|
| `full_name` | `full_name` | `full_name` | `text` |
| `job_title` | `job_title` | `job_title` | `text` |
| `email` | `email` | `email` | `text` |
| `phone` | `phone` | `phone` | `text` |
| `location` | `location` | `location` | `text` |

##### **Experience Data**
| Frontend Field | Backend Field | Database Field | Type |
|----------------|---------------|----------------|------|
| `experience[].position` | `experiences[].position` | `experiences[].position` | `jsonb` |
| `experience[].company` | `experiences[].company` | `experiences[].company` | `jsonb` |
| `experience[].start_date` | `experiences[].start_date` | `experiences[].start_date` | `jsonb` |
| `experience[].end_date` | `experiences[].end_date` | `experiences[].end_date` | `jsonb` |

##### **Skills Data**
| Frontend Field | Backend Field | Database Field | Type |
|----------------|---------------|----------------|------|
| `skills` | `skills` | `skills` | `jsonb` |

---

## 🛡️ **DATA VALIDATION RULES**

### **Field Validation**

#### **Required Fields**
- `cvs.title` - Must not be empty
- `cvs.user_id` - Must be valid UUID
- `profiles.id` - Must match auth.users.id

#### **Data Type Validation**
- `cvs.email` - Must be valid email format
- `cvs.phone` - Must be valid phone format
- `cvs.ats_score` - Must be integer between 0-100
- `cvs.is_public` - Must be boolean
- `cvs.template_id` - Must be valid template identifier

#### **JSONB Validation**
- `cvs.experiences` - Must be array of experience objects
- `cvs.education` - Must be array of education objects
- `cvs.skills` - Must be array of strings
- `cvs.projects` - Must be array of project objects

---

## 📈 **PERFORMANCE CONSIDERATIONS**

### **Query Optimization**
- Use indexes for frequently queried fields
- Limit JSONB queries to specific paths
- Use pagination for large result sets
- Implement caching for static data

### **Storage Optimization**
- Compress large text fields
- Use appropriate data types
- Archive old data when necessary
- Monitor table sizes and growth

---

## 🔧 **MIGRATION GUIDELINES**

### **Schema Changes**
1. **Create Migration Script**: Document all changes
2. **Test in Development**: Verify changes work correctly
3. **Backup Production**: Always backup before migration
4. **Deploy Migration**: Apply changes to production
5. **Verify Data**: Check data integrity after migration

### **Field Additions**
```sql
-- Add new field
ALTER TABLE public.cvs ADD COLUMN new_field text;

-- Add default value
ALTER TABLE public.cvs ALTER COLUMN new_field SET DEFAULT 'default_value';

-- Add constraint
ALTER TABLE public.cvs ADD CONSTRAINT check_new_field CHECK (new_field IS NOT NULL);
```

### **Field Modifications**
```sql
-- Change data type
ALTER TABLE public.cvs ALTER COLUMN field_name TYPE new_type;

-- Change default value
ALTER TABLE public.cvs ALTER COLUMN field_name SET DEFAULT new_default;

-- Remove default value
ALTER TABLE public.cvs ALTER COLUMN field_name DROP DEFAULT;
```

---

## 📞 **SCHEMA SUPPORT**

### **Documentation References**
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **JSONB Functions**: https://www.postgresql.org/docs/current/functions-json.html

### **Common Queries**
```sql
-- Get user's CVs
SELECT * FROM public.cvs WHERE user_id = auth.uid();

-- Get public CVs
SELECT * FROM public.cvs WHERE is_public = true;

-- Get CVs by template
SELECT * FROM public.cvs WHERE template_id = 'modern';

-- Get recent CVs
SELECT * FROM public.cvs ORDER BY created_at DESC LIMIT 10;
```

---

*This schema document serves as the definitive reference for all database operations in the ApplyAce platform. Always reference this document before making any database changes or field mappings.* 