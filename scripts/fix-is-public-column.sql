-- Fix for "Could not find the 'is_public' column of 'cvs' in the schema cache"
-- This migration ensures the column exists and refreshes the schema cache

-- Step 1: Add the column if it doesn't exist (safe operation)
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Step 2: Update any existing rows that might have NULL values
UPDATE public.cvs SET is_public = false WHERE is_public IS NULL;

-- Step 3: Make sure the column is not nullable (if it was added)
ALTER TABLE public.cvs ALTER COLUMN is_public SET NOT NULL;

-- Step 4: Add a comment for documentation
COMMENT ON COLUMN public.cvs.is_public IS 'Whether this CV is publicly visible';

-- Step 5: Refresh the schema cache (this is the key fix)
-- Note: This requires superuser privileges or specific PostgREST configuration
-- If you're using Supabase Cloud, this will be handled automatically
-- If you're using local PostgREST, you may need to restart the service

-- Step 6: Verify the column exists
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'cvs' AND column_name = 'is_public'; 