-- Fix Database Issues
-- Run this in your Supabase SQL editor to fix the missing view and other issues

-- 1. Drop the existing view if it exists
DROP VIEW IF EXISTS job_applications_with_content;

-- 2. Create the corrected view that matches the actual table structure
CREATE OR REPLACE VIEW job_applications_with_content AS
SELECT 
  ja.id,
  ja.user_id,
  ja.job_title,
  ja.company_name as company,
  ja.location,
  ja.job_url,
  ja.job_description,
  ja.match_score,
  ja.status,
  ja.application_date as applied_at,
  ja.created_at,
  ja.updated_at,
  cv.id as cv_id,
  cv.full_name as cv_title, -- Use full_name instead of title
  cv.summary as cv_content, -- Use summary instead of content
  cv.is_primary as is_tailored, -- Use is_primary as fallback
  cv.content_type as cv_ai_model, -- Use content_type as fallback
  cl.id as cover_letter_id,
  cl.content as cover_letter_content,
  cl.is_ai_generated,
  cl.ai_model as cover_letter_ai_model
FROM job_applications ja
LEFT JOIN cvs cv ON cv.id = ja.cv_id
LEFT JOIN cover_letters cl ON cl.job_application_id = ja.id;

-- 3. Grant permissions
GRANT SELECT ON job_applications_with_content TO authenticated;

-- 4. Add missing columns to CVs table if they don't exist
ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS job_application_id uuid REFERENCES job_applications(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_tailored boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tailored_for_job text,
ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'gpt-4o-mini';

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cvs_job_application_id ON cvs(job_application_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_tailored ON cvs(is_tailored);

-- Success message
SELECT 'Database issues fixed successfully!' as status; 