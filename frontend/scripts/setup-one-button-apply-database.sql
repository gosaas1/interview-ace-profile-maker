-- One Button Apply Database Setup
-- Run this in your Supabase SQL editor to set up all necessary tables

-- 1. Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title text NOT NULL,
  company text NOT NULL,
  location text,
  job_url text,
  job_description text,
  match_score integer DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'applied', 'interview', 'rejected', 'offer')),
  applied_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Cover Letters Table
CREATE TABLE IF NOT EXISTS cover_letters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cv_id uuid REFERENCES cvs(id) ON DELETE CASCADE,
  job_application_id uuid REFERENCES job_applications(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_ai_generated boolean DEFAULT true,
  ai_model text DEFAULT 'gpt-4o-mini',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Add fields to existing CVs table
ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS job_application_id uuid REFERENCES job_applications(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_tailored boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tailored_for_job text,
ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'gpt-4o-mini';

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_job_application_id ON cover_letters(job_application_id);
CREATE INDEX IF NOT EXISTS idx_cvs_job_application_id ON cvs(job_application_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_tailored ON cvs(is_tailored);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for job_applications
DROP POLICY IF EXISTS "Users can view their own job applications" ON job_applications;
CREATE POLICY "Users can view their own job applications" ON job_applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own job applications" ON job_applications;
CREATE POLICY "Users can insert their own job applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own job applications" ON job_applications;
CREATE POLICY "Users can update their own job applications" ON job_applications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own job applications" ON job_applications;
CREATE POLICY "Users can delete their own job applications" ON job_applications
  FOR DELETE USING (auth.uid() = user_id);

-- 7. RLS Policies for cover_letters
DROP POLICY IF EXISTS "Users can view their own cover letters" ON cover_letters;
CREATE POLICY "Users can view their own cover letters" ON cover_letters
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cover letters" ON cover_letters;
CREATE POLICY "Users can insert their own cover letters" ON cover_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cover letters" ON cover_letters;
CREATE POLICY "Users can update their own cover letters" ON cover_letters
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cover letters" ON cover_letters;
CREATE POLICY "Users can delete their own cover letters" ON cover_letters
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at 
  BEFORE UPDATE ON job_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cover_letters_updated_at ON cover_letters;
CREATE TRIGGER update_cover_letters_updated_at 
  BEFORE UPDATE ON cover_letters 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create a view for easy querying of applications with related data
CREATE OR REPLACE VIEW job_applications_with_content AS
SELECT 
  ja.id,
  ja.user_id,
  ja.job_title,
  ja.company,
  ja.location,
  ja.job_url,
  ja.job_description,
  ja.match_score,
  ja.status,
  ja.applied_at,
  ja.created_at,
  ja.updated_at,
  cv.id as cv_id,
  cv.title as cv_title,
  cv.content as cv_content,
  cv.is_tailored,
  cv.ai_model as cv_ai_model,
  cl.id as cover_letter_id,
  cl.content as cover_letter_content,
  cl.is_ai_generated,
  cl.ai_model as cover_letter_ai_model
FROM job_applications ja
LEFT JOIN cvs cv ON cv.job_application_id = ja.id
LEFT JOIN cover_letters cl ON cl.job_application_id = ja.id;

-- 10. Grant permissions
GRANT ALL ON job_applications TO authenticated;
GRANT ALL ON cover_letters TO authenticated;
GRANT SELECT ON job_applications_with_content TO authenticated;

-- 11. Insert some sample data for testing (optional)
-- INSERT INTO job_applications (user_id, job_title, company, location, job_url, match_score, status) 
-- VALUES 
--   ('your-user-id-here', 'Software Engineer', 'Tech Corp', 'London, UK', 'https://linkedin.com/jobs/view/123', 85, 'applied'),
--   ('your-user-id-here', 'Product Manager', 'Startup Inc', 'Remote', 'https://linkedin.com/jobs/view/456', 92, 'interview');

-- Success message
SELECT 'One Button Apply database setup completed successfully!' as status; 