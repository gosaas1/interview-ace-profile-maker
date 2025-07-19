-- Migration: Enhance user tier lookup and management
-- Description: Add real-time tier lookup, upgrade tracking, and tier history

-- Add tier-related columns to profiles table if they don't exist
DO $$ 
BEGIN
    -- Add tier column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'tier') THEN
        ALTER TABLE profiles ADD COLUMN tier VARCHAR(20) NOT NULL DEFAULT 'free' 
        CHECK (tier IN ('free', 'starter', 'pro', 'career_pro', 'elite_exec'));
    END IF;
    
    -- Add tier_updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'tier_updated_at') THEN
        ALTER TABLE profiles ADD COLUMN tier_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add tier_expires_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'tier_expires_at') THEN
        ALTER TABLE profiles ADD COLUMN tier_expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add subscription_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'subscription_id') THEN
        ALTER TABLE profiles ADD COLUMN subscription_id VARCHAR(255);
    END IF;
END $$;

-- Create tier_history table to track tier changes
CREATE TABLE IF NOT EXISTS tier_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    old_tier VARCHAR(20),
    new_tier VARCHAR(20) NOT NULL,
    change_reason VARCHAR(100) NOT NULL CHECK (change_reason IN ('upgrade', 'downgrade', 'expiration', 'admin_change', 'trial')),
    subscription_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for tier_history
CREATE INDEX IF NOT EXISTS idx_tier_history_user_id ON tier_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tier_history_created_at ON tier_history(created_at);
CREATE INDEX IF NOT EXISTS idx_tier_history_change_reason ON tier_history(change_reason);

-- Create tier_limits table to define tier capabilities
CREATE TABLE IF NOT EXISTS tier_limits (
    tier_name VARCHAR(20) PRIMARY KEY,
    cv_parse_limit INTEGER NOT NULL DEFAULT 1,
    ai_rewrite_limit INTEGER NOT NULL DEFAULT 0,
    cover_letter_limit INTEGER NOT NULL DEFAULT 0,
    interview_session_limit INTEGER NOT NULL DEFAULT 0,
    job_apply_limit INTEGER NOT NULL DEFAULT 0,
    cost_per_cv_parse DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    cost_per_ai_rewrite DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    cost_per_cover_letter DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    cost_per_interview DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    cost_per_job_apply DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tier limits
INSERT INTO tier_limits (tier_name, cv_parse_limit, ai_rewrite_limit, cover_letter_limit, interview_session_limit, job_apply_limit, cost_per_cv_parse, cost_per_ai_rewrite, cost_per_cover_letter, cost_per_interview, cost_per_job_apply, features) VALUES
('free', 1, 0, 0, 0, 0, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, '{"basic_templates": true, "community_support": true}'),
('starter', 3, 1, 1, 0, 0, 0.0500, 0.2500, 0.5000, 0.0000, 0.0000, '{"premium_templates": true, "email_support": true, "ai_rewrite": true, "cover_letters": true}'),
('pro', 10, 5, 5, 2, 0, 0.0400, 0.2000, 0.4000, 1.0000, 0.0000, '{"all_templates": true, "priority_support": true, "interview_coaching": true, "advanced_analytics": true}'),
('career_pro', 25, 15, 15, 5, 5, 0.0350, 0.1750, 0.3500, 0.8000, 0.1000, '{"career_guidance": true, "personal_coaching": true, "job_matching": true, "resume_review": true}'),
('elite_exec', 100, 50, 50, 20, 20, 0.0300, 0.1500, 0.3000, 0.6000, 0.0800, '{"executive_support": true, "1on1_coaching": true, "custom_templates": true, "white_glove_service": true}')
ON CONFLICT (tier_name) DO UPDATE SET
    cv_parse_limit = EXCLUDED.cv_parse_limit,
    ai_rewrite_limit = EXCLUDED.ai_rewrite_limit,
    cover_letter_limit = EXCLUDED.cover_letter_limit,
    interview_session_limit = EXCLUDED.interview_session_limit,
    job_apply_limit = EXCLUDED.job_apply_limit,
    cost_per_cv_parse = EXCLUDED.cost_per_cv_parse,
    cost_per_ai_rewrite = EXCLUDED.cost_per_ai_rewrite,
    cost_per_cover_letter = EXCLUDED.cost_per_cover_letter,
    cost_per_interview = EXCLUDED.cost_per_interview,
    cost_per_job_apply = EXCLUDED.cost_per_job_apply,
    features = EXCLUDED.features,
    updated_at = NOW();

-- Function to update tier_limits updated_at timestamp
CREATE OR REPLACE FUNCTION update_tier_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tier_limits
CREATE TRIGGER trigger_update_tier_limits_updated_at
    BEFORE UPDATE ON tier_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_tier_limits_updated_at();

-- Function to get current user tier with limits
CREATE OR REPLACE FUNCTION get_user_tier_info(user_uuid UUID)
RETURNS TABLE (
    tier_name VARCHAR(20),
    cv_parse_limit INTEGER,
    ai_rewrite_limit INTEGER,
    cover_letter_limit INTEGER,
    interview_session_limit INTEGER,
    job_apply_limit INTEGER,
    features JSONB,
    tier_expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.tier,
        tl.cv_parse_limit,
        tl.ai_rewrite_limit,
        tl.cover_letter_limit,
        tl.interview_session_limit,
        tl.job_apply_limit,
        tl.features,
        p.tier_expires_at
    FROM profiles p
    JOIN tier_limits tl ON p.tier = tl.tier_name
    WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can perform action
CREATE OR REPLACE FUNCTION can_perform_action(
    user_uuid UUID,
    action_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier VARCHAR(20);
    current_usage INTEGER;
    tier_limit INTEGER;
BEGIN
    -- Get user's current tier
    SELECT tier INTO user_tier FROM profiles WHERE id = user_uuid;
    
    -- Check if tier has expired
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_uuid 
        AND tier_expires_at IS NOT NULL 
        AND tier_expires_at < NOW()
    ) THEN
        -- Downgrade to free tier
        UPDATE profiles SET tier = 'free', tier_updated_at = NOW() WHERE id = user_uuid;
        user_tier := 'free';
    END IF;
    
    -- Get current usage for this action type
    SELECT COALESCE(SUM(resource_consumed), 0) INTO current_usage
    FROM usage_history
    WHERE user_id = user_uuid 
    AND action_type = $2
    AND created_at >= DATE_TRUNC('month', NOW());
    
    -- Get tier limit for this action
    CASE action_type
        WHEN 'cv_parse' THEN SELECT cv_parse_limit INTO tier_limit FROM tier_limits WHERE tier_name = user_tier;
        WHEN 'ai_rewrite' THEN SELECT ai_rewrite_limit INTO tier_limit FROM tier_limits WHERE tier_name = user_tier;
        WHEN 'cover_letter' THEN SELECT cover_letter_limit INTO tier_limit FROM tier_limits WHERE tier_name = user_tier;
        WHEN 'interview_session' THEN SELECT interview_session_limit INTO tier_limit FROM tier_limits WHERE tier_name = user_tier;
        WHEN 'job_apply' THEN SELECT job_apply_limit INTO tier_limit FROM tier_limits WHERE tier_name = user_tier;
        ELSE tier_limit := 0;
    END CASE;
    
    -- Return true if unlimited (-1) or within limit
    RETURN tier_limit = -1 OR current_usage < tier_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for tier_history
ALTER TABLE tier_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tier history" ON tier_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage tier history" ON tier_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS policies for tier_limits (read-only for users, full access for admins)
ALTER TABLE tier_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tier limits" ON tier_limits
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage tier limits" ON tier_limits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT ON tier_history TO authenticated;
GRANT SELECT ON tier_limits TO authenticated;
GRANT ALL ON tier_history TO service_role;
GRANT ALL ON tier_limits TO service_role;
GRANT EXECUTE ON FUNCTION get_user_tier_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_perform_action(UUID, VARCHAR) TO authenticated; 
 
 