-- Add cover_letter column to job_applications table
-- This fixes the PGRST204 error: "Could not find the 'cover_letter' column of 'job_applications' in the schema cache"

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS cover_letter TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN job_applications.cover_letter IS 'Generated cover letter for the job application';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'job_applications' 
AND column_name = 'cover_letter'; 