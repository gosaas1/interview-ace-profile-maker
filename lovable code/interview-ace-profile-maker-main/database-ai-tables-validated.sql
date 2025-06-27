-- AI Tables Script with Database Validation
-- This script first validates the existing database structure and then creates compatible AI tables
-- Run this in your Supabase SQL Editor

-- ====================================
-- 1. DATABASE STRUCTURE VALIDATION
-- ====================================

-- Check if cvs table exists and get its structure
DO $$
BEGIN
    RAISE NOTICE 'Checking existing database structure...';
    
    -- Check if cvs table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cvs' AND table_schema = 'public') THEN
        RAISE NOTICE 'CVs table found. Checking structure...';
    ELSE
        RAISE EXCEPTION 'CVs table not found! Please create the CVs table first.';
    END IF;
    
    -- Check if profiles table exists (used in original script)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        RAISE NOTICE 'Profiles table found.';
    ELSE
        RAISE NOTICE 'Profiles table not found. Will use auth.users instead.';
    END IF;
END $$;

-- Display current CVs table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'cvs' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check CVs table primary key type (UUID vs BIGINT)
SELECT 
    kcu.column_name,
    kcu.data_type,
    CASE 
        WHEN kcu.data_type = 'uuid' THEN 'UUID'
        WHEN kcu.data_type = 'bigint' THEN 'BIGINT'
        ELSE kcu.data_type
    END as key_type
FROM information_schema.key_column_usage kcu
JOIN information_schema.table_constraints tc 
    ON kcu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'cvs' 
    AND tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public';

-- ====================================
-- 2. CREATE AI TABLES WITH VALIDATION
-- ====================================

-- Determine the correct foreign key type for cv_id
DO $$
DECLARE
    cv_id_type TEXT;
    user_reference TEXT;
BEGIN
    -- Get the data type of cvs.id
    SELECT data_type INTO cv_id_type
    FROM information_schema.columns 
    WHERE table_name = 'cvs' 
        AND column_name = 'id' 
        AND table_schema = 'public';
    
    -- Determine user reference table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        user_reference := 'profiles(id)';
    ELSE
        user_reference := 'auth.users(id)';
    END IF;
    
    RAISE NOTICE 'CVs ID type: %, User reference: %', cv_id_type, user_reference;
    
    -- Create AI Analyses table with correct foreign key type
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS ai_analyses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            cv_id %s NOT NULL,
            user_id UUID NOT NULL,
            provider TEXT NOT NULL CHECK (provider IN (''openai'', ''gemini'', ''claude'', ''local'')),
            model TEXT NOT NULL,
            analysis_type TEXT NOT NULL CHECK (analysis_type IN (''basic'', ''detailed'', ''premium'')),
            
            -- Core Scores
            overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
            ats_compatibility INTEGER NOT NULL CHECK (ats_compatibility >= 0 AND ats_compatibility <= 100),
            readability_score INTEGER NOT NULL CHECK (readability_score >= 0 AND readability_score <= 100),
            
            -- Detailed Scores (JSON)
            scores JSONB NOT NULL DEFAULT ''{}''::jsonb,
            
            -- Analysis Results (JSON Arrays)
            strengths JSONB NOT NULL DEFAULT ''[]''::jsonb,
            weaknesses JSONB NOT NULL DEFAULT ''[]''::jsonb,
            suggestions JSONB NOT NULL DEFAULT ''[]''::jsonb,
            
            -- Keywords Analysis
            missing_keywords JSONB NOT NULL DEFAULT ''[]''::jsonb,
            present_keywords JSONB NOT NULL DEFAULT ''[]''::jsonb,
            keyword_density DECIMAL(5,4) DEFAULT 0,
            
            -- Industry Insights (Premium Features)
            industry_match INTEGER CHECK (industry_match IS NULL OR (industry_match >= 0 AND industry_match <= 100)),
            salary_range JSONB,
            
            -- Performance Metadata
            processing_time INTEGER NOT NULL, -- milliseconds
            token_usage JSONB NOT NULL DEFAULT ''{}''::jsonb,
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', cv_id_type);
    
    -- Add foreign key constraints
    EXECUTE format('
        ALTER TABLE ai_analyses 
        ADD CONSTRAINT fk_ai_analyses_cv_id 
        FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
    ');
    
    EXECUTE format('
        ALTER TABLE ai_analyses 
        ADD CONSTRAINT fk_ai_analyses_user_id 
        FOREIGN KEY (user_id) REFERENCES %s ON DELETE CASCADE
    ', user_reference);
    
    RAISE NOTICE 'AI Analyses table created successfully with correct foreign key types.';
END $$;

-- Create AI Usage table
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10,6) NOT NULL DEFAULT 0,
    analysis_type TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for ai_usage
DO $$
DECLARE
    user_reference TEXT;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        user_reference := 'profiles(id)';
    ELSE
        user_reference := 'auth.users(id)';
    END IF;
    
    EXECUTE format('
        ALTER TABLE ai_usage 
        ADD CONSTRAINT fk_ai_usage_user_id 
        FOREIGN KEY (user_id) REFERENCES %s ON DELETE CASCADE
    ', user_reference);
END $$;

-- Create User AI Settings table
CREATE TABLE IF NOT EXISTS user_ai_settings (
    user_id UUID PRIMARY KEY,
    preferred_provider TEXT DEFAULT 'gemini' CHECK (preferred_provider IN ('openai', 'gemini', 'claude', 'local')),
    analysis_level TEXT DEFAULT 'basic' CHECK (analysis_level IN ('basic', 'detailed', 'premium')),
    auto_analyze BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    monthly_usage_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for user_ai_settings
DO $$
DECLARE
    user_reference TEXT;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        user_reference := 'profiles(id)';
    ELSE
        user_reference := 'auth.users(id)';
    END IF;
    
    EXECUTE format('
        ALTER TABLE user_ai_settings 
        ADD CONSTRAINT fk_user_ai_settings_user_id 
        FOREIGN KEY (user_id) REFERENCES %s ON DELETE CASCADE
    ', user_reference);
END $$;

-- ====================================
-- 3. ADD SUBSCRIPTION TIER SAFELY
-- ====================================

-- Add subscription_tier to the appropriate user table
DO $$ 
DECLARE
    target_table TEXT;
BEGIN
    -- Determine which table to add subscription_tier to
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        target_table := 'profiles';
    ELSE
        -- If no profiles table, we'll need to create a user_profiles table or use auth.user_metadata
        RAISE NOTICE 'No profiles table found. Consider creating a user_profiles table for subscription management.';
        RETURN;
    END IF;
    
    -- Check if subscription_tier column already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = target_table 
        AND column_name = 'subscription_tier' 
        AND table_schema = 'public'
    ) THEN
        EXECUTE format('
            ALTER TABLE %s 
            ADD COLUMN subscription_tier TEXT DEFAULT ''free'' 
            CHECK (subscription_tier IN (''free'', ''payAsYouGo'', ''essential'', ''professional'', ''executive''))
        ', target_table);
        RAISE NOTICE 'Added subscription_tier column to % table.', target_table;
    ELSE
        RAISE NOTICE 'subscription_tier column already exists in % table.', target_table;
    END IF;
END $$;

-- ====================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ====================================

-- Indexes for AI analyses
CREATE INDEX IF NOT EXISTS idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_cv_id ON ai_analyses(cv_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_created_at ON ai_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_provider ON ai_analyses(provider);

-- Indexes for AI usage
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_usage_provider ON ai_usage(provider);

-- ====================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ====================================

ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_settings ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 6. CREATE RLS POLICIES
-- ====================================

-- AI Analyses Policies
DROP POLICY IF EXISTS "Users can view their own AI analyses" ON ai_analyses;
CREATE POLICY "Users can view their own AI analyses" ON ai_analyses
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI analyses" ON ai_analyses;
CREATE POLICY "Users can insert their own AI analyses" ON ai_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI analyses" ON ai_analyses;
CREATE POLICY "Users can update their own AI analyses" ON ai_analyses
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own AI analyses" ON ai_analyses;
CREATE POLICY "Users can delete their own AI analyses" ON ai_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- AI Usage Policies
DROP POLICY IF EXISTS "Users can view their own AI usage" ON ai_usage;
CREATE POLICY "Users can view their own AI usage" ON ai_usage
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can insert AI usage records" ON ai_usage;
CREATE POLICY "Service can insert AI usage records" ON ai_usage
    FOR INSERT WITH CHECK (true); -- Allow service to track usage

-- User AI Settings Policies
DROP POLICY IF EXISTS "Users can view their own AI settings" ON user_ai_settings;
CREATE POLICY "Users can view their own AI settings" ON user_ai_settings
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI settings" ON user_ai_settings;
CREATE POLICY "Users can insert their own AI settings" ON user_ai_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI settings" ON user_ai_settings;
CREATE POLICY "Users can update their own AI settings" ON user_ai_settings
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own AI settings" ON user_ai_settings;
CREATE POLICY "Users can delete their own AI settings" ON user_ai_settings
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- 7. CREATE TRIGGERS
-- ====================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_ai_analyses_updated_at ON ai_analyses;
CREATE TRIGGER update_ai_analyses_updated_at 
    BEFORE UPDATE ON ai_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_ai_settings_updated_at ON user_ai_settings;
CREATE TRIGGER update_user_ai_settings_updated_at 
    BEFORE UPDATE ON user_ai_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 8. FINAL VALIDATION
-- ====================================

-- Verify all tables were created successfully
DO $$
BEGIN
    RAISE NOTICE '=== AI TABLES CREATION SUMMARY ===';
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_analyses' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ ai_analyses table created successfully';
    ELSE
        RAISE NOTICE '❌ ai_analyses table creation failed';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_usage' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ ai_usage table created successfully';
    ELSE
        RAISE NOTICE '❌ ai_usage table creation failed';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_ai_settings' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ user_ai_settings table created successfully';
    ELSE
        RAISE NOTICE '❌ user_ai_settings table creation failed';
    END IF;
    
    RAISE NOTICE '=== SETUP COMPLETE ===';
    RAISE NOTICE 'You can now use the AI CV Analysis system!';
END $$; 