-- Fix user_id constraint to allow null values for unauthenticated users
-- This allows the CV creation to work without requiring authentication

-- First, drop the existing foreign key constraint
ALTER TABLE public.cvs DROP CONSTRAINT IF EXISTS cvs_user_id_fkey;

-- Add the constraint back but allow null values
ALTER TABLE public.cvs ADD CONSTRAINT cvs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update the column to allow null values
ALTER TABLE public.cvs ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment to document this change
COMMENT ON COLUMN public.cvs.user_id IS 'User ID for authenticated users, null for unauthenticated users';

-- Verify the change
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'cvs' AND column_name = 'user_id'; 