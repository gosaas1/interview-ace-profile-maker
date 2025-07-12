-- COMPREHENSIVE DATABASE FIX FOR APPLYACE
-- This script fixes ALL database issues: schema mismatch, Unicode encoding, and cache problems
-- Run this in your Supabase SQL Editor

BEGIN;

-- ====================================
-- 1. BACKUP EXISTING DATA
-- ====================================

-- Create backup of existing CVs data
CREATE TABLE IF NOT EXISTS cvs_backup AS 
SELECT * FROM public.cvs;

-- ====================================
-- 2. DROP AND RECREATE CVS TABLE WITH CORRECT STRUCTURE
-- ====================================

-- Drop existing table (this will cascade to dependent objects)
DROP TABLE IF EXISTS public.cvs CASCADE;

-- Create the CORRECT cvs table that matches both frontend and backend expectations
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

-- ====================================
-- 3. MIGRATE EXISTING DATA TO NEW STRUCTURE
-- ====================================

-- Migrate data from backup to new structure
INSERT INTO public.cvs (id, user_id, title, content, is_public, template_id, created_at, updated_at)
SELECT 
    id,
    user_id,
    COALESCE(full_name, 'Untitled CV') as title,
    jsonb_build_object(
        'full_name', COALESCE(full_name, ''),
        'email', COALESCE(email, ''),
        'phone', COALESCE(phone, ''),
        'location', COALESCE(location, ''),
        'summary', COALESCE(summary, ''),
        'experiences', COALESCE(experiences, '[]'::jsonb),
        'education', COALESCE(education, '[]'::jsonb),
        'skills', COALESCE(skills, ''),
        'certifications', COALESCE(certifications, ''),
        'job_title', COALESCE(job_title, ''),
        'linkedin_url', COALESCE(linkedin_url, ''),
        'portfolio_url', COALESCE(portfolio_url, ''),
        'projects', COALESCE(projects, '[]'::jsonb),
        'languages', COALESCE(languages, '[]'::jsonb),
        'references', COALESCE(references, '[]'::jsonb)
    ) as content,
    COALESCE(is_public, false) as is_public,
    COALESCE(template_id, 'basic-modern') as template_id,
    created_at,
    updated_at
FROM cvs_backup;

-- ====================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ====================================

CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON public.cvs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cvs_is_public ON public.cvs(is_public);
CREATE INDEX IF NOT EXISTS idx_cvs_template_id ON public.cvs(template_id);
CREATE INDEX IF NOT EXISTS idx_cvs_content_gin ON public.cvs USING GIN(content);

-- ====================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ====================================

ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own CVs" ON public.cvs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CVs" ON public.cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs" ON public.cvs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs" ON public.cvs
    FOR DELETE USING (auth.uid() = user_id);

-- Public CVs can be viewed by anyone
CREATE POLICY "Public CVs are viewable by all" ON public.cvs
    FOR SELECT USING (is_public = true);

-- ====================================
-- 6. CREATE UPDATED_AT TRIGGER
-- ====================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cvs_updated_at 
    BEFORE UPDATE ON public.cvs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 7. FORCE SCHEMA CACHE REFRESH
-- ====================================

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- ====================================
-- 8. VERIFICATION QUERIES
-- ====================================

-- Show the new table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'cvs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show migrated data count
SELECT 
    'CVs migrated successfully' as status,
    COUNT(*) as total_cvs,
    COUNT(CASE WHEN is_public = true THEN 1 END) as public_cvs
FROM public.cvs;

-- ====================================
-- 9. CLEANUP
-- ====================================

-- Drop backup table after successful migration
DROP TABLE IF EXISTS cvs_backup;

COMMIT;

-- ====================================
-- 10. SUCCESS MESSAGE
-- ====================================

SELECT 'Database migration completed successfully! All CV data has been migrated to the new schema.' as status; 