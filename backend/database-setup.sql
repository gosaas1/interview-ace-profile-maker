-- Database Setup for Applyace - Comprehensive Career Platform
-- Run this in your Supabase SQL Editor

-- ====================================
-- EXISTING TABLES - CV & JOBS MODULE
-- ====================================

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
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    template_id TEXT DEFAULT 'modern',
    is_primary BOOLEAN DEFAULT false,
    ats_score INTEGER DEFAULT 0,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    content_type TEXT DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ... (rest of file continues) 