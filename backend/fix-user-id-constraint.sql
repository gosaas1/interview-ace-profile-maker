-- Fix user_id foreign key constraint to allow null values
-- This allows unauthenticated users to create CVs

-- First, drop the existing foreign key constraint
ALTER TABLE public.cvs DROP CONSTRAINT IF EXISTS cvs_user_id_fkey;

-- Recreate the foreign key constraint with ON DELETE SET NULL
ALTER TABLE public.cvs 
ADD CONSTRAINT cvs_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;

-- Make sure the user_id column allows null values
ALTER TABLE public.cvs ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment to document this change
COMMENT ON COLUMN public.cvs.user_id IS 'User ID from auth.users table. NULL for unauthenticated users.';

-- Verify the changes
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'cvs' AND column_name = 'user_id';

-- Show the foreign key constraint
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'cvs'
    AND kcu.column_name = 'user_id'; 