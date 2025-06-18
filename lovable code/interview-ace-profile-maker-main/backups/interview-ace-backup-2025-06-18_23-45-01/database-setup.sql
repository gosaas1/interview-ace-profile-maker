-- Database Setup for Interview Ace Profile Maker
-- Run this in your Supabase SQL Editor

-- Create the cvs table
CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    location TEXT,
    summary TEXT,
    experiences JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills TEXT,
    certifications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own CVs
CREATE POLICY "Users can view own CVs" ON public.cvs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own CVs
CREATE POLICY "Users can insert own CVs" ON public.cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own CVs
CREATE POLICY "Users can update own CVs" ON public.cvs
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own CVs
CREATE POLICY "Users can delete own CVs" ON public.cvs
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON public.cvs(created_at);

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

-- Grant necessary permissions
GRANT ALL ON public.cvs TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 