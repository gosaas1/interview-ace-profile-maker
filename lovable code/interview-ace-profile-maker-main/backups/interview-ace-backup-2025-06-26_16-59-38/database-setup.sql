-- Database Setup for Applyace - Comprehensive Career Platform
-- Run this in your Supabase SQL Editor

-- ====================================
-- EXISTING TABLES - CV & JOBS MODULE
-- ====================================

-- Create the cvs table
CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    location TEXT,
    summary TEXT,
    experiences JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills TEXT,
    certifications TEXT,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
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

-- JOBS TABLE
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

-- COVER LETTERS TABLE
CREATE TABLE IF NOT EXISTS cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ====================================
-- NEW TABLES - INTERVIEW COACH MODULE
-- ====================================

-- INTERVIEW SESSIONS TABLE
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_type TEXT NOT NULL CHECK (session_type IN ('practice', 'mock', 'simulation', 'assessment')),
    industry TEXT,
    job_role TEXT,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    questions_total INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (confidence_score BETWEEN 0.0 AND 10.0),
    overall_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (overall_rating BETWEEN 0.0 AND 10.0),
    duration_minutes INTEGER DEFAULT 0,
    session_status TEXT DEFAULT 'active' CHECK (session_status IN ('active', 'completed', 'paused', 'abandoned')),
    ai_feedback JSONB DEFAULT '{}'::jsonb,
    improvement_areas TEXT[],
    strengths TEXT[],
    recommendations TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    subcategory TEXT,
    industry TEXT,
    job_role TEXT,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    question_type TEXT DEFAULT 'behavioral' CHECK (question_type IN ('behavioral', 'technical', 'situational', 'case-study', 'general')),
    question_text TEXT NOT NULL,
    question_context TEXT,
    sample_answer TEXT,
    sample_keywords TEXT[],
    evaluation_criteria JSONB DEFAULT '{}'::jsonb,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- USER RESPONSES TABLE
CREATE TABLE IF NOT EXISTS user_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    response_text TEXT,
    response_audio_url TEXT,
    response_video_url TEXT,
    response_duration_seconds INTEGER DEFAULT 0,
    confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (confidence_score BETWEEN 0.0 AND 10.0),
    clarity_score DECIMAL(3,2) DEFAULT 0.0 CHECK (clarity_score BETWEEN 0.0 AND 10.0),
    relevance_score DECIMAL(3,2) DEFAULT 0.0 CHECK (relevance_score BETWEEN 0.0 AND 10.0),
    structure_score DECIMAL(3,2) DEFAULT 0.0 CHECK (structure_score BETWEEN 0.0 AND 10.0),
    overall_score DECIMAL(3,2) DEFAULT 0.0 CHECK (overall_score BETWEEN 0.0 AND 10.0),
    ai_feedback JSONB DEFAULT '{}'::jsonb,
    improvement_suggestions TEXT[],
    keywords_used TEXT[],
    keywords_missing TEXT[],
    response_status TEXT DEFAULT 'completed' CHECK (response_status IN ('started', 'completed', 'skipped', 'timeout')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module_type TEXT NOT NULL CHECK (module_type IN ('interview', 'cv', 'jobs')),
    skill_area TEXT,
    current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 10),
    experience_points INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    average_score DECIMAL(3,2) DEFAULT 0.0,
    last_session_date TIMESTAMP WITH TIME ZONE,
    goals JSONB DEFAULT '{}'::jsonb,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    UNIQUE(user_id, module_type, skill_area)
);

-- ====================================
-- ENABLE ROW LEVEL SECURITY
-- ====================================

-- Enable RLS on existing tables
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Enable RLS on new tables
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ====================================
-- ROW LEVEL SECURITY POLICIES
-- ====================================

-- CVs policies
CREATE POLICY "Users can view own CVs" ON public.cvs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CVs" ON public.cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs" ON public.cvs
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs" ON public.cvs
    FOR DELETE USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Users can manage their own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);

-- Cover letters policies
CREATE POLICY "Users can manage their own cover letters" ON cover_letters FOR ALL USING (auth.uid() = user_id);

-- Interview sessions policies
CREATE POLICY "Users can view own interview sessions" ON interview_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interview sessions" ON interview_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interview sessions" ON interview_sessions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interview sessions" ON interview_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Questions policies (public read, admin write)
CREATE POLICY "Users can view questions" ON questions
    FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage questions" ON questions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User responses policies
CREATE POLICY "Users can view own responses" ON user_responses
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own responses" ON user_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own responses" ON user_responses
    FOR UPDATE USING (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

-- Existing indexes
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON public.cvs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);

-- New indexes for interview module
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON interview_sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_industry ON questions(industry);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_question_id ON user_responses(question_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_progress(module_type);

-- ====================================
-- TRIGGERS AND FUNCTIONS
-- ====================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_cvs_updated_at 
    BEFORE UPDATE ON public.cvs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_sessions_updated_at 
    BEFORE UPDATE ON interview_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update user progress after completing a session
CREATE OR REPLACE FUNCTION update_user_progress_after_session()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert user progress for interview module
    INSERT INTO user_progress (user_id, module_type, skill_area, sessions_completed, average_score, last_session_date)
    VALUES (NEW.user_id, 'interview', NEW.industry, 1, NEW.overall_rating, NEW.completed_at)
    ON CONFLICT (user_id, module_type, skill_area)
    DO UPDATE SET
        sessions_completed = user_progress.sessions_completed + 1,
        average_score = (user_progress.average_score * user_progress.sessions_completed + NEW.overall_rating) / (user_progress.sessions_completed + 1),
        last_session_date = NEW.completed_at,
        updated_at = timezone('utc', now());
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update progress when session is completed
CREATE TRIGGER update_progress_after_interview_session 
    AFTER UPDATE ON interview_sessions 
    FOR EACH ROW 
    WHEN (NEW.session_status = 'completed' AND OLD.session_status != 'completed')
    EXECUTE FUNCTION update_user_progress_after_session();

-- ====================================
-- SAMPLE DATA - INTERVIEW QUESTIONS
-- ====================================

-- Insert sample interview questions
INSERT INTO questions (category, subcategory, industry, difficulty, question_type, question_text, sample_answer, sample_keywords, tags) VALUES
-- General behavioral questions
('Behavioral', 'Leadership', 'General', 2, 'behavioral', 'Tell me about a time when you had to lead a team through a difficult situation.', 'I led a team of 5 developers during a critical project deadline. When we faced technical challenges, I organized daily standups, redistributed tasks based on strengths, and maintained open communication. We delivered the project on time and the team felt supported throughout the process.', ARRAY['leadership', 'teamwork', 'communication', 'problem-solving'], ARRAY['leadership', 'teamwork', 'general']),

('Behavioral', 'Problem Solving', 'General', 2, 'behavioral', 'Describe a challenging problem you solved at work.', 'When our main server crashed during peak hours, I quickly assessed the situation, implemented a backup solution, and coordinated with the team to minimize downtime. I also created a prevention plan to avoid similar issues in the future.', ARRAY['problem-solving', 'crisis-management', 'technical-skills'], ARRAY['problem-solving', 'general']),

-- Technology specific
('Technical', 'Programming', 'Technology', 3, 'technical', 'Explain the difference between SQL and NoSQL databases.', 'SQL databases are relational with structured schemas and ACID compliance, ideal for complex queries. NoSQL databases are flexible, schema-less, and better for scalability and handling unstructured data. Choice depends on data structure, scalability needs, and consistency requirements.', ARRAY['databases', 'SQL', 'NoSQL', 'scalability'], ARRAY['technical', 'databases', 'technology']),

('Technical', 'Web Development', 'Technology', 3, 'technical', 'What is the difference between React and Angular?', 'React is a JavaScript library focused on building user interfaces with a component-based architecture and virtual DOM. Angular is a full framework with TypeScript, dependency injection, and built-in features like routing and forms. React offers more flexibility, while Angular provides a complete solution.', ARRAY['React', 'Angular', 'JavaScript', 'frameworks'], ARRAY['technical', 'frontend', 'technology']),

-- Marketing specific
('Industry', 'Digital Marketing', 'Marketing', 2, 'behavioral', 'How do you measure the success of a marketing campaign?', 'I measure success through KPIs aligned with campaign objectives: ROI, conversion rates, customer acquisition cost, engagement metrics, and brand awareness. I use tools like Google Analytics, social media insights, and A/B testing to track performance and optimize strategies based on data-driven insights.', ARRAY['KPIs', 'ROI', 'analytics', 'conversion'], ARRAY['marketing', 'analytics', 'strategy']),

-- Finance specific
('Industry', 'Financial Analysis', 'Finance', 4, 'technical', 'Walk me through a DCF model.', 'A DCF model values a company by projecting future cash flows and discounting them to present value. Start with revenue projections, subtract operating expenses and taxes to get free cash flow. Choose appropriate discount rate (WACC), project 5-10 years, add terminal value, and sum all discounted cash flows.', ARRAY['DCF', 'cash-flow', 'valuation', 'WACC'], ARRAY['finance', 'valuation', 'modeling'])

ON CONFLICT DO NOTHING;

-- ====================================
-- PERMISSIONS
-- ====================================

-- Grant necessary permissions
GRANT ALL ON public.cvs TO authenticated;
GRANT ALL ON jobs TO authenticated;
GRANT ALL ON cover_letters TO authenticated;
GRANT ALL ON interview_sessions TO authenticated;
GRANT SELECT ON questions TO authenticated;
GRANT ALL ON user_responses TO authenticated;
GRANT ALL ON user_progress TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant admin permissions for questions management
GRANT ALL ON questions TO service_role; 