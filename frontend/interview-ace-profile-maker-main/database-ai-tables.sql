-- AI Analysis Results Table
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('openai', 'gemini', 'claude', 'local')),
    model TEXT NOT NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('basic', 'detailed', 'premium')),
    
    -- Core Scores
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    ats_compatibility INTEGER NOT NULL CHECK (ats_compatibility >= 0 AND ats_compatibility <= 100),
    readability_score INTEGER NOT NULL CHECK (readability_score >= 0 AND readability_score <= 100),
    
    -- Detailed Scores (JSON)
    scores JSONB NOT NULL DEFAULT '{}',
    
    -- Analysis Results (JSON Arrays)
    strengths JSONB NOT NULL DEFAULT '[]',
    weaknesses JSONB NOT NULL DEFAULT '[]',
    suggestions JSONB NOT NULL DEFAULT '[]',
    
    -- Keywords Analysis
    missing_keywords JSONB NOT NULL DEFAULT '[]',
    present_keywords JSONB NOT NULL DEFAULT '[]',
    keyword_density DECIMAL(5,4) DEFAULT 0,
    
    -- Industry Insights (Premium Features)
    industry_match INTEGER CHECK (industry_match IS NULL OR (industry_match >= 0 AND industry_match <= 100)),
    salary_range JSONB,
    
    -- Performance Metadata
    processing_time INTEGER NOT NULL, -- milliseconds
    token_usage JSONB NOT NULL DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Usage Tracking Table
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10,6) NOT NULL DEFAULT 0,
    analysis_type TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User AI Settings Table
CREATE TABLE IF NOT EXISTS user_ai_settings (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_provider TEXT DEFAULT 'gemini' CHECK (preferred_provider IN ('openai', 'gemini', 'claude', 'local')),
    analysis_level TEXT DEFAULT 'basic' CHECK (analysis_level IN ('basic', 'detailed', 'premium')),
    auto_analyze BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    monthly_usage_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add subscription_tier to profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'payAsYouGo', 'essential', 'professional', 'executive'));
    END IF;
END $$;

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_cv_id ON ai_analyses(cv_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_created_at ON ai_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_provider ON ai_analyses(provider);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_usage_provider ON ai_usage(provider);

-- RLS Policies
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_settings ENABLE ROW LEVEL SECURITY;

-- AI Analyses Policies
CREATE POLICY "Users can view their own AI analyses" ON ai_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI analyses" ON ai_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI analyses" ON ai_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI analyses" ON ai_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- AI Usage Policies
CREATE POLICY "Users can view their own AI usage" ON ai_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert AI usage records" ON ai_usage
    FOR INSERT WITH CHECK (true); -- Allow service to track usage

-- User AI Settings Policies
CREATE POLICY "Users can view their own AI settings" ON user_ai_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI settings" ON user_ai_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI settings" ON user_ai_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI settings" ON user_ai_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_analyses_updated_at BEFORE UPDATE ON ai_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ai_settings_updated_at BEFORE UPDATE ON user_ai_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 