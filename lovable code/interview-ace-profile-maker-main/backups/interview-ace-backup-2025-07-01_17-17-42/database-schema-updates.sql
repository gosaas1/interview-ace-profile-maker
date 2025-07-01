-- Database Schema Updates to Fix CV Builder Issues
-- Run this AFTER the main database-setup.sql

-- Add missing columns to cvs table that exist in TypeScript interface
ALTER TABLE public.cvs 
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS references JSONB DEFAULT '[]'::jsonb;

-- Update existing records to have empty arrays for new JSONB fields
UPDATE public.cvs 
SET 
    projects = COALESCE(projects, '[]'::jsonb),
    languages = COALESCE(languages, '[]'::jsonb),
    references = COALESCE(references, '[]'::jsonb)
WHERE 
    projects IS NULL 
    OR languages IS NULL 
    OR references IS NULL;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_cvs_job_title ON public.cvs(job_title);
CREATE INDEX IF NOT EXISTS idx_cvs_linkedin_url ON public.cvs(linkedin_url);

-- Add comment to track this update
COMMENT ON TABLE public.cvs IS 'Updated to match TypeScript CVData interface - includes job_title, linkedin_url, portfolio_url, projects, languages, references'; 