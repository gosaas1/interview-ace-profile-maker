-- Migration: Create parsing_logs table
-- Description: Track CV parsing activities, performance metrics, and error handling

CREATE TABLE IF NOT EXISTS parsing_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
    parsing_method VARCHAR(50) NOT NULL CHECK (parsing_method IN ('textract', 'cohere', 'mammoth', 'text', 'manual')),
    file_type VARCHAR(20) CHECK (file_type IN ('pdf', 'docx', 'txt', 'rtf')),
    file_size_bytes BIGINT,
    processing_time_ms INTEGER,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    extracted_text_length INTEGER,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_parsing_logs_user_id ON parsing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_parsing_logs_cv_id ON parsing_logs(cv_id);
CREATE INDEX IF NOT EXISTS idx_parsing_logs_parsing_method ON parsing_logs(parsing_method);
CREATE INDEX IF NOT EXISTS idx_parsing_logs_success ON parsing_logs(success);
CREATE INDEX IF NOT EXISTS idx_parsing_logs_created_at ON parsing_logs(created_at);

-- Composite index for analytics
CREATE INDEX IF NOT EXISTS idx_parsing_logs_user_method_date ON parsing_logs(user_id, parsing_method, created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_parsing_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_parsing_logs_updated_at
    BEFORE UPDATE ON parsing_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_parsing_logs_updated_at();

-- RLS (Row Level Security) policies
ALTER TABLE parsing_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own parsing logs
CREATE POLICY "Users can view own parsing logs" ON parsing_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own parsing logs
CREATE POLICY "Users can insert own parsing logs" ON parsing_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all parsing logs
CREATE POLICY "Admins can view all parsing logs" ON parsing_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT ON parsing_logs TO authenticated;
GRANT ALL ON parsing_logs TO service_role;

-- Create view for parsing analytics
CREATE OR REPLACE VIEW parsing_analytics AS
SELECT 
    user_id,
    parsing_method,
    COUNT(*) as total_attempts,
    COUNT(*) FILTER (WHERE success = true) as successful_parses,
    COUNT(*) FILTER (WHERE success = false) as failed_parses,
    AVG(processing_time_ms) as avg_processing_time,
    AVG(confidence_score) as avg_confidence,
    AVG(file_size_bytes) as avg_file_size,
    MIN(created_at) as first_parse,
    MAX(created_at) as last_parse
FROM parsing_logs
GROUP BY user_id, parsing_method;

-- Grant access to the view
GRANT SELECT ON parsing_analytics TO authenticated;
GRANT SELECT ON parsing_analytics TO service_role; 
 
 