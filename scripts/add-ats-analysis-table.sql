-- Add ATS analysis table for storing CV optimization results
CREATE TABLE IF NOT EXISTS cv_ats_analysis (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id uuid REFERENCES cvs(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  grammar_suggestions text[] DEFAULT '{}',
  keyword_match integer NOT NULL CHECK (keyword_match >= 0 AND keyword_match <= 100),
  missing_keywords text[] DEFAULT '{}',
  overall_feedback text,
  readability_score integer CHECK (readability_score >= 0 AND readability_score <= 100),
  formatting_score integer CHECK (formatting_score >= 0 AND formatting_score <= 100),
  action_verb_score integer CHECK (action_verb_score >= 0 AND action_verb_score <= 100),
  quantifiable_achievements integer CHECK (quantifiable_achievements >= 0 AND quantifiable_achievements <= 100),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cv_ats_analysis_cv_id ON cv_ats_analysis(cv_id);
CREATE INDEX IF NOT EXISTS idx_cv_ats_analysis_score ON cv_ats_analysis(score);
CREATE INDEX IF NOT EXISTS idx_cv_ats_analysis_created_at ON cv_ats_analysis(created_at);

-- Add RLS policies
ALTER TABLE cv_ats_analysis ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own ATS analysis results
CREATE POLICY "Users can view own ATS analysis" ON cv_ats_analysis
  FOR SELECT USING (
    cv_id IN (
      SELECT id FROM cvs WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert their own ATS analysis results
CREATE POLICY "Users can insert own ATS analysis" ON cv_ats_analysis
  FOR INSERT WITH CHECK (
    cv_id IN (
      SELECT id FROM cvs WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can update their own ATS analysis results
CREATE POLICY "Users can update own ATS analysis" ON cv_ats_analysis
  FOR UPDATE USING (
    cv_id IN (
      SELECT id FROM cvs WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete their own ATS analysis results
CREATE POLICY "Users can delete own ATS analysis" ON cv_ats_analysis
  FOR DELETE USING (
    cv_id IN (
      SELECT id FROM cvs WHERE user_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON TABLE cv_ats_analysis IS 'Stores ATS (Applicant Tracking System) analysis results for CVs';
COMMENT ON COLUMN cv_ats_analysis.score IS 'Overall ATS optimization score (0-100)';
COMMENT ON COLUMN cv_ats_analysis.keyword_match IS 'Percentage of job keywords matched (0-100)';
COMMENT ON COLUMN cv_ats_analysis.readability_score IS 'Flesch Reading Ease score (0-100)';
COMMENT ON COLUMN cv_ats_analysis.formatting_score IS 'Formatting and structure score (0-100)';
COMMENT ON COLUMN cv_ats_analysis.action_verb_score IS 'Action verb usage score (0-100)';
COMMENT ON COLUMN cv_ats_analysis.quantifiable_achievements IS 'Quantifiable achievements score (0-100)'; 