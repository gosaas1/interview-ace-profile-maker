-- Fix Supabase Schema Cache Issue
-- This script ensures the 'is_public' column exists in the 'cvs' table

-- First, let's check the current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'cvs'
ORDER BY ordinal_position;

-- Add is_public column if it doesn't exist
DO $$
BEGIN
    -- Add is_public column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cvs' 
        AND column_name = 'is_public'
    ) THEN
        ALTER TABLE cvs ADD COLUMN is_public BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_public column to cvs table';
    ELSE
        RAISE NOTICE 'is_public column already exists in cvs table';
    END IF;
END $$;

-- Update existing records to have is_public = false if NULL
UPDATE cvs SET is_public = false WHERE is_public IS NULL;

-- Verify the column exists and show final structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'cvs' 
ORDER BY ordinal_position;

-- Show table structure
\d cvs;

-- Force refresh the schema cache by running a simple query
SELECT COUNT(*) FROM cvs WHERE is_public = false; 