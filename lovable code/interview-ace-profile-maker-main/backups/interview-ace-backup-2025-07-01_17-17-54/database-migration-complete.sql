-- Complete Database Migration to Fix CV Upload Issues
-- Run this in your Supabase SQL Editor to add ALL missing columns

-- First, let's see the current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'cvs' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add ALL missing columns to cvs table
ALTER TABLE public.cvs 
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern',
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ats_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'manual';

-- Update existing records to have default values
UPDATE public.cvs 
SET 
    template_id = COALESCE(template_id, 'modern'),
    is_primary = COALESCE(is_primary, false),
    ats_score = COALESCE(ats_score, 0),
    content_type = COALESCE(content_type, 'manual')
WHERE template_id IS NULL OR is_primary IS NULL OR ats_score IS NULL OR content_type IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cvs_template_id ON public.cvs(template_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_primary ON public.cvs(is_primary);
CREATE INDEX IF NOT EXISTS idx_cvs_file_url ON public.cvs(file_url);
CREATE INDEX IF NOT EXISTS idx_cvs_ats_score ON public.cvs(ats_score);
CREATE INDEX IF NOT EXISTS idx_cvs_content_type ON public.cvs(content_type);

-- Force Supabase to refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify ALL columns exist after migration
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'cvs' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show a success message
SELECT 'Migration completed successfully! All columns added to cvs table.' as status; 