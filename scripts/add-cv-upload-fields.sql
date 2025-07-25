-- Migration: Add new fields to cvs table for CV upload flow
-- Date: 2024-12-19

-- Add new fields for CV upload functionality
ALTER TABLE public.cvs 
ADD COLUMN IF NOT EXISTS parsed_data jsonb,
ADD COLUMN IF NOT EXISTS raw_text text,
ADD COLUMN IF NOT EXISTS upload_url text;

-- Update existing records to have default values
UPDATE public.cvs 
SET 
  parsed_data = '{}'::jsonb,
  raw_text = '',
  upload_url = ''
WHERE parsed_data IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.cvs.parsed_data IS 'Structured JSON data from CV parsing (Cohere/Mammoth)';
COMMENT ON COLUMN public.cvs.raw_text IS 'Original raw text content from uploaded CV';
COMMENT ON COLUMN public.cvs.upload_url IS 'URL to uploaded file in storage';
COMMENT ON COLUMN public.cvs.ats_score IS 'ATS optimization score (0-100)';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS cvs_parsed_data_idx ON public.cvs USING gin (parsed_data);
CREATE INDEX IF NOT EXISTS cvs_content_type_idx ON public.cvs(content_type); 