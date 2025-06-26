-- Database Migration to Fix CV Upload Issues
-- Run this in your Supabase SQL Editor to add missing columns

-- Add missing columns to cvs table
ALTER TABLE public.cvs 
ADD COLUMN IF NOT EXISTS ats_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'manual';

-- Update existing records to have default values
UPDATE public.cvs 
SET 
    ats_score = COALESCE(ats_score, 0),
    content_type = COALESCE(content_type, 'manual')
WHERE ats_score IS NULL OR content_type IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cvs_file_url ON public.cvs(file_url);
CREATE INDEX IF NOT EXISTS idx_cvs_ats_score ON public.cvs(ats_score);

-- Verify the columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'cvs' 
AND table_schema = 'public'
ORDER BY ordinal_position; 