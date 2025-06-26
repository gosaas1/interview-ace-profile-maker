-- Database Improvements Script for Interview Ace Profile Maker
-- Run this script in your Supabase SQL Editor

-- 1. Improve the CVs table structure
ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS parsed_data JSONB,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS education TEXT[],
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS achievements TEXT[],
ADD COLUMN IF NOT EXISTS projects JSONB[],
ADD COLUMN IF NOT EXISTS contact_info JSONB,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON cvs(created_at);
CREATE INDEX IF NOT EXISTS idx_cvs_is_active ON cvs(is_active);
CREATE INDEX IF NOT EXISTS idx_cvs_skills ON cvs USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_cvs_tags ON cvs USING GIN(tags);

-- 2. Create user_profiles table for extended user information
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    bio TEXT,
    avatar_url TEXT,
    preferred_job_titles TEXT[],
    preferred_locations TEXT[],
    salary_expectations JSONB,
    availability VARCHAR(50),
    work_authorization VARCHAR(100),
    years_of_experience INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add RLS policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for job_applications
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_job_applications_application_date ON job_applications(application_date);

-- Add RLS policies for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job applications" ON job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job applications" ON job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job applications" ON job_applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job applications" ON job_applications
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    interview_type VARCHAR(50) DEFAULT 'phone',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 60,
    interviewer_name VARCHAR(255),
    interviewer_email VARCHAR(255),
    interviewer_role VARCHAR(255),
    location VARCHAR(500),
    meeting_link VARCHAR(500),
    status VARCHAR(50) DEFAULT 'scheduled',
    preparation_notes TEXT,
    questions_asked TEXT[],
    answers_given TEXT[],
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    outcome VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for interviews
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_date ON interviews(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);

-- Add RLS policies for interviews
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interviews" ON interviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews" ON interviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews" ON interviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews" ON interviews
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Create analytics table for tracking user activity
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT
);

-- Add indexes for analytics
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_timestamp ON user_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);

-- Add RLS policies for user_analytics
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON user_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON user_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Create cv_versions table for version control
CREATE TABLE IF NOT EXISTS cv_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content TEXT,
    changes_made TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(cv_id, version_number)
);

-- Add RLS policies for cv_versions
ALTER TABLE cv_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CV versions" ON cv_versions
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own CV versions" ON cv_versions
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- 7. Create templates table for CV templates
CREATE TABLE IF NOT EXISTS cv_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    preview_image_url TEXT,
    category VARCHAR(100),
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default templates
INSERT INTO cv_templates (name, description, template_data, category) VALUES
('Modern Professional', 'Clean and modern design perfect for tech and business roles', '{"layout": "modern", "colors": {"primary": "#2563eb", "secondary": "#64748b"}, "sections": ["header", "summary", "experience", "education", "skills"]}', 'professional'),
('Creative Designer', 'Eye-catching design for creative professionals', '{"layout": "creative", "colors": {"primary": "#7c3aed", "secondary": "#ec4899"}, "sections": ["header", "portfolio", "experience", "skills", "education"]}', 'creative'),
('Executive', 'Sophisticated template for senior-level positions', '{"layout": "executive", "colors": {"primary": "#1f2937", "secondary": "#6b7280"}, "sections": ["header", "executive_summary", "experience", "achievements", "education"]}', 'executive')
ON CONFLICT DO NOTHING;

-- 8. Update functions for better data handling
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cv_templates_updated_at BEFORE UPDATE ON cv_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-create user profile
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 10. Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES 
('cv-files', 'cv-files', true),
('profile-images', 'profile-images', true),
('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 11. Create storage policies
CREATE POLICY "Users can upload their own CV files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own CV files" ON storage.objects
    FOR SELECT USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CV files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CV files" ON storage.objects
    FOR DELETE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Similar policies for profile images
CREATE POLICY "Users can upload their own profile images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own profile images" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
    FOR DELETE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Company logos are public read
CREATE POLICY "Anyone can view company logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload company logos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

-- 12. Create views for better data access
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    u.id as user_id,
    COUNT(DISTINCT c.id) as total_cvs,
    COUNT(DISTINCT ja.id) as total_applications,
    COUNT(DISTINCT i.id) as total_interviews,
    COUNT(DISTINCT CASE WHEN ja.status = 'applied' THEN ja.id END) as pending_applications,
    COUNT(DISTINCT CASE WHEN i.status = 'scheduled' THEN i.id END) as upcoming_interviews,
    AVG(ja.match_score) as avg_match_score
FROM auth.users u
LEFT JOIN cvs c ON u.id = c.user_id AND c.is_active = true
LEFT JOIN job_applications ja ON u.id = ja.user_id
LEFT JOIN interviews i ON u.id = i.user_id
GROUP BY u.id;

-- 13. Create function for CV text search
CREATE OR REPLACE FUNCTION search_cvs(search_term TEXT, user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.content,
        c.created_at,
        ts_rank(to_tsvector('english', COALESCE(c.content, '') || ' ' || COALESCE(c.title, '')), plainto_tsquery('english', search_term)) as rank
    FROM cvs c
    WHERE c.user_id = user_uuid 
        AND c.is_active = true
        AND to_tsvector('english', COALESCE(c.content, '') || ' ' || COALESCE(c.title, '')) @@ plainto_tsquery('english', search_term)
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Add some sample data for testing (optional)
-- This will only run if there are users in the system
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Get a sample user ID if exists
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Insert sample job application
        INSERT INTO job_applications (user_id, job_title, company_name, status, match_score, location, job_type)
        VALUES (sample_user_id, 'Senior Software Engineer', 'Tech Corp', 'applied', 85, 'San Francisco, CA', 'Full-time')
        ON CONFLICT DO NOTHING;
        
        -- Insert sample interview
        INSERT INTO interviews (user_id, interview_type, scheduled_date, status, interviewer_name)
        VALUES (sample_user_id, 'video', NOW() + INTERVAL '3 days', 'scheduled', 'John Smith')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 15. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable real-time for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE cvs;
ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE interviews;
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

COMMIT;

-- Script completed successfully!
-- This script has created:
-- 1. Enhanced CVs table with better structure
-- 2. User profiles table
-- 3. Job applications tracking
-- 4. Interview management
-- 5. Analytics tracking
-- 6. CV version control
-- 7. CV templates
-- 8. Storage buckets and policies
-- 9. Useful views and functions
-- 10. Sample data for testing 