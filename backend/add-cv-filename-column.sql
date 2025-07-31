-- Add cv_filename column to cvs table
-- This separates CV filename from person's full_name to avoid confusion

ALTER TABLE cvs 
ADD COLUMN cv_filename VARCHAR(255);

-- Update existing records to set cv_filename = title
UPDATE cvs 
SET cv_filename = title 
WHERE cv_filename IS NULL;

-- Make cv_filename NOT NULL after setting values
ALTER TABLE cvs 
ALTER COLUMN cv_filename SET NOT NULL;

-- Add index for better performance
CREATE INDEX idx_cvs_cv_filename ON cvs(cv_filename); 