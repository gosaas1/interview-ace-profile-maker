-- Complete Database Setup for ApplyAce - One-Button Apply Workflow
-- Run this in your Supabase SQL Editor

-- ====================================
-- CORE TABLES
-- ====================================

-- CVs Table (Enhanced)
CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    job_title TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    summary TEXT,
    experiences JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    references JSONB DEFAULT '[]'::jsonb,
    skills TEXT,
    certifications TEXT,
    template_id TEXT DEFAULT 'modern',
    is_primary BOOLEAN DEFAULT false,
    ats_score INTEGER DEFAULT 0,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    content_type TEXT DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jobs Table (Enhanced)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    company TEXT,
    job_url TEXT,
    description TEXT,
    requirements TEXT[],
    salary_range JSONB,
    location TEXT,
    job_type TEXT DEFAULT 'full-time',
    industry TEXT,
    application_status TEXT DEFAULT 'saved',
    applied_at TIMESTAMP WITH TIME ZONE,
    response_received BOOLEAN DEFAULT false,
    interview_invited BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Job Applications Table (Core of One-Button Apply)
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_url VARCHAR(500),
    job_description TEXT,
    application_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'applied',
    priority VARCHAR(20) DEFAULT 'medium',
    salary_range VARCHAR(100),
    location VARCHAR(255),
    job_type VARCHAR(50),
    notes TEXT,
    follow_up_date DATE,
    interview_scheduled BOOLEAN DEFAULT false,
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_notes TEXT,
    feedback TEXT,
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    requirements_met JSONB,
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cover Letters Table
CREATE TABLE IF NOT EXISTS cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT false,
    ai_model VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Auto-Suggestions Table (Comprehensive)
CREATE TABLE IF NOT EXISTS auto_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'job_title', 'duty', 'education', 'skill', 'company', 'location'
    value TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    is_global BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, value)
);

-- Interview Sessions Table (Cross-Module Integration)
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE SET NULL,
    session_type VARCHAR(50) DEFAULT 'mock', -- 'mock', 'practice', 'real'
    industry TEXT,
    job_role TEXT,
    difficulty_level INTEGER DEFAULT 1,
    questions_total INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    confidence_score DECIMAL(3,2),
    overall_rating DECIMAL(3,2),
    duration_minutes INTEGER,
    session_status VARCHAR(50) DEFAULT 'in_progress',
    ai_feedback JSONB,
    improvement_areas TEXT[],
    strengths TEXT[],
    recommendations TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions Bank Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    industry VARCHAR(50),
    job_role VARCHAR(100),
    difficulty INTEGER DEFAULT 1,
    question_type VARCHAR(50) DEFAULT 'behavioral',
    question_text TEXT NOT NULL,
    question_context TEXT,
    sample_answer TEXT,
    sample_keywords TEXT[],
    evaluation_criteria JSONB,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Responses Table
CREATE TABLE IF NOT EXISTS user_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    response_text TEXT,
    response_audio_url TEXT,
    response_video_url TEXT,
    response_duration_seconds INTEGER,
    confidence_score DECIMAL(3,2),
    clarity_score DECIMAL(3,2),
    relevance_score DECIMAL(3,2),
    structure_score DECIMAL(3,2),
    overall_score DECIMAL(3,2),
    ai_feedback JSONB,
    improvement_suggestions TEXT[],
    keywords_used TEXT[],
    keywords_missing TEXT[],
    response_status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

-- CVs indexes
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_job_title ON public.cvs(job_title);
CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON public.cvs(created_at);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(application_status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

-- Job Applications indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_cv_id ON job_applications(cv_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_job_applications_application_date ON job_applications(application_date);

-- Auto-suggestions indexes
CREATE INDEX IF NOT EXISTS idx_auto_suggestions_category ON auto_suggestions(category);
CREATE INDEX IF NOT EXISTS idx_auto_suggestions_value ON auto_suggestions(value);
CREATE INDEX IF NOT EXISTS idx_auto_suggestions_global ON auto_suggestions(is_global);
CREATE INDEX IF NOT EXISTS idx_auto_suggestions_user_category ON auto_suggestions(user_id, category);

-- Interview sessions indexes
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_job_application_id ON interview_sessions(job_application_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON interview_sessions(session_status);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_industry ON questions(industry);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

-- User responses indexes
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_question_id ON user_responses(question_id);

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Enable RLS on all tables
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- CVs policies
CREATE POLICY "Users can view own CVs" ON public.cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CVs" ON public.cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs" ON public.cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs" ON public.cvs FOR DELETE USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Users can view own jobs" ON jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = user_id);

-- Job Applications policies
CREATE POLICY "Users can view own job applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job applications" ON job_applications FOR DELETE USING (auth.uid() = user_id);

-- Cover Letters policies
CREATE POLICY "Users can view own cover letters" ON cover_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cover letters" ON cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cover letters" ON cover_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cover letters" ON cover_letters FOR DELETE USING (auth.uid() = user_id);

-- Auto-suggestions policies
CREATE POLICY "Users can view global suggestions" ON auto_suggestions FOR SELECT USING (is_global = true);
CREATE POLICY "Users can view own suggestions" ON auto_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own suggestions" ON auto_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own suggestions" ON auto_suggestions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own suggestions" ON auto_suggestions FOR DELETE USING (auth.uid() = user_id);

-- Interview Sessions policies
CREATE POLICY "Users can view own interview sessions" ON interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interview sessions" ON interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interview sessions" ON interview_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interview sessions" ON interview_sessions FOR DELETE USING (auth.uid() = user_id);

-- Questions policies (read-only for users, admin can manage)
CREATE POLICY "Users can view active questions" ON questions FOR SELECT USING (is_active = true);

-- User Responses policies
CREATE POLICY "Users can view own responses" ON user_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own responses" ON user_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own responses" ON user_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own responses" ON user_responses FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- TRIGGERS FOR UPDATED_AT
-- ====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_cvs_updated_at BEFORE UPDATE ON public.cvs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auto_suggestions_updated_at BEFORE UPDATE ON auto_suggestions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_sessions_updated_at BEFORE UPDATE ON interview_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- GRANT PERMISSIONS
-- ====================================

GRANT ALL ON public.cvs TO authenticated;
GRANT ALL ON jobs TO authenticated;
GRANT ALL ON job_applications TO authenticated;
GRANT ALL ON cover_letters TO authenticated;
GRANT ALL ON auto_suggestions TO authenticated;
GRANT ALL ON interview_sessions TO authenticated;
GRANT SELECT ON questions TO authenticated;
GRANT ALL ON user_responses TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ====================================
-- COMMENTS FOR DOCUMENTATION
-- ====================================

COMMENT ON TABLE public.cvs IS 'CV/Resume storage with comprehensive fields for one-button apply workflow';
COMMENT ON TABLE jobs IS 'Job listings and saved jobs for users';
COMMENT ON TABLE job_applications IS 'Core table for one-button apply workflow - tracks all job applications';
COMMENT ON TABLE cover_letters IS 'Generated and custom cover letters for job applications';
COMMENT ON TABLE auto_suggestions IS 'Auto-suggestions system for job titles, skills, duties, education, companies, and locations';
COMMENT ON TABLE interview_sessions IS 'Interview practice sessions and real interview tracking';
COMMENT ON TABLE questions IS 'Question bank for interview preparation';
COMMENT ON TABLE user_responses IS 'User responses to interview questions with AI feedback';

COMMENT ON TABLE job_applications IS 'Complete one-button apply workflow: CV selection, cover letter generation, application tracking, and interview preparation integration'; 