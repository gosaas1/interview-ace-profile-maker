-- Migration: Create usage_history table
-- Description: Track user usage patterns and tier consumption for analytics

CREATE TABLE IF NOT EXISTS usage_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('cv_parse', 'ai_rewrite', 'cover_letter', 'interview_session', 'job_apply')),
    resource_consumed INTEGER NOT NULL DEFAULT 1,
    cost_usd DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    tier_at_time VARCHAR(20) NOT NULL DEFAULT 'free',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_history_user_id ON usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_history_action_type ON usage_history(action_type);
CREATE INDEX IF NOT EXISTS idx_usage_history_created_at ON usage_history(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_history_tier_at_time ON usage_history(tier_at_time);

-- Composite index for user analytics
CREATE INDEX IF NOT EXISTS idx_usage_history_user_action_date ON usage_history(user_id, action_type, created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_usage_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_usage_history_updated_at
    BEFORE UPDATE ON usage_history
    FOR EACH ROW
    EXECUTE FUNCTION update_usage_history_updated_at();

-- RLS (Row Level Security) policies
ALTER TABLE usage_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage history
CREATE POLICY "Users can view own usage history" ON usage_history
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own usage records
CREATE POLICY "Users can insert own usage history" ON usage_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all usage history
CREATE POLICY "Admins can view all usage history" ON usage_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT ON usage_history TO authenticated;
GRANT ALL ON usage_history TO service_role; 
 