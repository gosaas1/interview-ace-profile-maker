-- CORRECT CV SCHEMA - Matches Backend Code Expectations
-- Run this in your Supabase SQL Editor to fix the database structure

-- Drop existing cvs table if it exists (WARNING: This will delete all existing CV data)
DROP TABLE IF EXISTS public.cvs CASCADE;

-- Create the correct cvs table that matches backend expectations
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

-- Create indexes for better performance
CREATE INDEX idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX idx_cvs_created_at ON public.cvs(created_at DESC);
CREATE INDEX idx_cvs_is_public ON public.cvs(is_public);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own CVs" ON public.cvs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CVs" ON public.cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs" ON public.cvs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs" ON public.cvs
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cvs_updated_at 
    BEFORE UPDATE ON public.cvs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a test record to verify the schema works
INSERT INTO public.cvs (
    user_id,
    title,
    content,
    is_public
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- dummy UUID for testing
    'Test CV',
    '{
        "full_name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "London, UK",
        "summary": "Experienced software developer",
        "experiences": [],
        "education": [],
        "skills": "JavaScript, React, Node.js",
        "certifications": ""
    }'::jsonb,
    false
);

-- Verify the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'cvs' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test query to verify everything works
SELECT 
    id,
    title,
    content->>'full_name' as full_name,
    is_public,
    created_at
FROM public.cvs 
LIMIT 5; 