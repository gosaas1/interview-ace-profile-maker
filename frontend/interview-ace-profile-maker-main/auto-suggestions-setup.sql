-- Auto-Suggestions Database Setup for ApplyAce
-- Run this in your Supabase SQL Editor

-- ====================================
-- AUTO-SUGGESTIONS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS auto_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'job_title', 'duty', 'education', 'skill', etc.
    value TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    is_global BOOLEAN DEFAULT false, -- true for system-wide suggestions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, value)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auto_suggestions_category ON auto_suggestions(category);
CREATE INDEX IF NOT EXISTS idx_auto_suggestions_value ON auto_suggestions(value);
CREATE INDEX IF NOT EXISTS idx_auto_suggestions_global ON auto_suggestions(is_global);

-- Enable RLS
ALTER TABLE auto_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view global suggestions" ON auto_suggestions
    FOR SELECT USING (is_global = true);
CREATE POLICY "Users can view own suggestions" ON auto_suggestions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own suggestions" ON auto_suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own suggestions" ON auto_suggestions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own suggestions" ON auto_suggestions
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- SEED DATA: COMMON JOB TITLES (US/UK)
-- ====================================
INSERT INTO auto_suggestions (category, value, is_global, usage_count) VALUES
('job_title', 'Software Engineer', true, 1000),
('job_title', 'Frontend Developer', true, 800),
('job_title', 'Backend Developer', true, 750),
('job_title', 'Full Stack Developer', true, 900),
('job_title', 'Data Scientist', true, 700),
('job_title', 'Product Manager', true, 600),
('job_title', 'Project Manager', true, 800),
('job_title', 'Business Analyst', true, 600),
('job_title', 'QA Engineer', true, 400),
('job_title', 'DevOps Engineer', true, 400),
('job_title', 'UX Designer', true, 500),
('job_title', 'HR Manager', true, 300),
('job_title', 'Accountant', true, 350),
('job_title', 'Teacher', true, 500),
('job_title', 'Nurse', true, 400),
('job_title', 'Doctor', true, 350),
('job_title', 'Solicitor', true, 200),
('job_title', 'Barrister', true, 100),
('job_title', 'Lecturer', true, 120),
('job_title', 'Research Scientist', true, 100),
('job_title', 'Civil Engineer', true, 200),
('job_title', 'Mechanical Engineer', true, 180),
('job_title', 'Electrical Engineer', true, 170),
('job_title', 'Marketing Manager', true, 450),
('job_title', 'Sales Manager', true, 400),
('job_title', 'Customer Service Representative', true, 350),
('job_title', 'Operations Manager', true, 400),
('job_title', 'Financial Analyst', true, 400),
('job_title', 'Graphic Designer', true, 300),
('job_title', 'Web Developer', true, 500),
('job_title', 'IT Support Specialist', true, 250),
('job_title', 'Pharmacist', true, 120),
('job_title', 'Paramedic', true, 80),
('job_title', 'Police Officer', true, 200),
('job_title', 'Firefighter', true, 150),
('job_title', 'Chef', true, 180),
('job_title', 'Waiter', true, 100),
('job_title', 'Retail Assistant', true, 120),
('job_title', 'Estate Agent', true, 90),
('job_title', 'Plumber', true, 80),
('job_title', 'Electrician', true, 80),
('job_title', 'Carpenter', true, 70),
('job_title', 'Mechanic', true, 90),
('job_title', 'Taxi Driver', true, 60),
('job_title', 'Train Driver', true, 50),
('job_title', 'Pilot', true, 40),
('job_title', 'Flight Attendant', true, 60),
('job_title', 'Dentist', true, 80),
('job_title', 'Veterinarian', true, 60),
('job_title', 'Physiotherapist', true, 50),
('job_title', 'Social Worker', true, 70),
('job_title', 'Librarian', true, 40),
('job_title', 'Journalist', true, 60),
('job_title', 'Photographer', true, 50),
('job_title', 'Musician', true, 40),
('job_title', 'Actor', true, 30),
('job_title', 'Artist', true, 30)
ON CONFLICT (category, value) DO UPDATE SET usage_count = auto_suggestions.usage_count + EXCLUDED.usage_count, updated_at = NOW();

-- ====================================
-- SEED DATA: COMMON DUTIES/TASKS (US/UK)
-- ====================================
INSERT INTO auto_suggestions (category, value, is_global, usage_count) VALUES
('duty', 'Develop and maintain software applications', true, 500),
('duty', 'Lead project teams to deliver on-time results', true, 400),
('duty', 'Analyze business requirements and processes', true, 350),
('duty', 'Design user interfaces and user experiences', true, 300),
('duty', 'Provide technical support to end users', true, 250),
('duty', 'Manage budgets and financial reports', true, 200),
('duty', 'Conduct market research and analysis', true, 180),
('duty', 'Teach and mentor students', true, 160),
('duty', 'Administer medication and monitor patient health', true, 150),
('duty', 'Prepare and deliver presentations', true, 140),
('duty', 'Negotiate contracts and agreements', true, 120),
('duty', 'Write and edit technical documentation', true, 110),
('duty', 'Plan and execute marketing campaigns', true, 100)
ON CONFLICT (category, value) DO UPDATE SET usage_count = auto_suggestions.usage_count + EXCLUDED.usage_count, updated_at = NOW();

-- ====================================
-- SEED DATA: COMMON EDUCATION TITLES (US/UK)
-- ====================================
INSERT INTO auto_suggestions (category, value, is_global, usage_count) VALUES
('education', 'Bachelor of Science (BSc)', true, 400),
('education', 'Bachelor of Arts (BA)', true, 350),
('education', 'Master of Science (MSc)', true, 300),
('education', 'Master of Arts (MA)', true, 250),
('education', 'Doctor of Philosophy (PhD)', true, 200),
('education', 'Bachelor of Engineering (BEng)', true, 180),
('education', 'Master of Engineering (MEng)', true, 150),
('education', 'Bachelor of Laws (LLB)', true, 120),
('education', 'Master of Laws (LLM)', true, 100),
('education', 'Doctor of Medicine (MD)', true, 80),
('education', 'GCSE', true, 70),
('education', 'A-Level', true, 60),
('education', 'High School Diploma', true, 50),
('education', 'Associate Degree', true, 40),
('education', 'Diploma of Higher Education (DipHE)', true, 30)
ON CONFLICT (category, value) DO UPDATE SET usage_count = auto_suggestions.usage_count + EXCLUDED.usage_count, updated_at = NOW();

-- ====================================
-- POPULATE WITH COMMON SKILLS
-- ====================================

INSERT INTO auto_suggestions (category, value, is_global, usage_count) VALUES
-- Programming Languages
('skill', 'JavaScript', true, 1200),
('skill', 'TypeScript', true, 800),
('skill', 'Python', true, 1000),
('skill', 'Java', true, 900),
('skill', 'C++', true, 600),
('skill', 'C#', true, 500),
('skill', 'Go', true, 300),
('skill', 'Rust', true, 200),
('skill', 'PHP', true, 400),
('skill', 'Ruby', true, 300),
('skill', 'Swift', true, 250),
('skill', 'Kotlin', true, 200),
('skill', 'Scala', true, 150),
('skill', 'R', true, 200),
('skill', 'MATLAB', true, 150),

-- Frontend Technologies
('skill', 'React', true, 1000),
('skill', 'Vue.js', true, 400),
('skill', 'Angular', true, 500),
('skill', 'Next.js', true, 300),
('skill', 'Nuxt.js', true, 150),
('skill', 'Svelte', true, 100),
('skill', 'HTML5', true, 1200),
('skill', 'CSS3', true, 1200),
('skill', 'Sass', true, 400),
('skill', 'Less', true, 200),
('skill', 'Tailwind CSS', true, 300),
('skill', 'Bootstrap', true, 500),
('skill', 'Material-UI', true, 300),
('skill', 'Ant Design', true, 200),
('skill', 'Redux', true, 400),
('skill', 'Vuex', true, 200),
('skill', 'Zustand', true, 100),
('skill', 'GraphQL', true, 300),
('skill', 'REST API', true, 800),

-- Backend Technologies
('skill', 'Node.js', true, 800),
('skill', 'Express.js', true, 600),
('skill', 'Django', true, 400),
('skill', 'Flask', true, 300),
('skill', 'Spring Boot', true, 500),
('skill', 'ASP.NET', true, 300),
('skill', 'Laravel', true, 200),
('skill', 'FastAPI', true, 150),
('skill', 'Gin', true, 100),
('skill', 'Echo', true, 80),

-- Databases
('skill', 'PostgreSQL', true, 600),
('skill', 'MySQL', true, 500),
('skill', 'MongoDB', true, 400),
('skill', 'Redis', true, 300),
('skill', 'Elasticsearch', true, 200),
('skill', 'Cassandra', true, 100),
('skill', 'DynamoDB', true, 150),
('skill', 'Firebase', true, 200),

-- Cloud & DevOps
('skill', 'AWS', true, 500),
('skill', 'Azure', true, 300),
('skill', 'Google Cloud', true, 250),
('skill', 'Docker', true, 400),
('skill', 'Kubernetes', true, 300),
('skill', 'Terraform', true, 200),
('skill', 'Jenkins', true, 250),
('skill', 'GitLab CI', true, 150),
('skill', 'GitHub Actions', true, 200),
('skill', 'Ansible', true, 100),
('skill', 'Puppet', true, 80),
('skill', 'Chef', true, 60),

-- Data Science & ML
('skill', 'TensorFlow', true, 200),
('skill', 'PyTorch', true, 180),
('skill', 'Scikit-learn', true, 250),
('skill', 'Pandas', true, 400),
('skill', 'NumPy', true, 350),
('skill', 'Matplotlib', true, 200),
('skill', 'Seaborn', true, 150),
('skill', 'Plotly', true, 100),
('skill', 'Jupyter', true, 300),
('skill', 'Apache Spark', true, 100),
('skill', 'Hadoop', true, 80),
('skill', 'Kafka', true, 120),

-- Mobile Development
('skill', 'React Native', true, 300),
('skill', 'Flutter', true, 200),
('skill', 'Xamarin', true, 100),
('skill', 'Ionic', true, 80),
('skill', 'Cordova', true, 60),

-- Testing
('skill', 'Jest', true, 300),
('skill', 'Cypress', true, 200),
('skill', 'Selenium', true, 150),
('skill', 'Playwright', true, 100),
('skill', 'Puppeteer', true, 80),
('skill', 'Mocha', true, 100),
('skill', 'Chai', true, 80),
('skill', 'Pytest', true, 150),
('skill', 'JUnit', true, 120),

-- Version Control
('skill', 'Git', true, 1000),
('skill', 'GitHub', true, 800),
('skill', 'GitLab', true, 300),
('skill', 'Bitbucket', true, 200),
('skill', 'SVN', true, 100),

-- Project Management
('skill', 'Agile', true, 600),
('skill', 'Scrum', true, 500),
('skill', 'Kanban', true, 300),
('skill', 'Jira', true, 400),
('skill', 'Confluence', true, 200),
('skill', 'Trello', true, 150),
('skill', 'Asana', true, 100),
('skill', 'Monday.com', true, 80),

-- Soft Skills
('skill', 'Leadership', true, 800),
('skill', 'Communication', true, 1000),
('skill', 'Problem Solving', true, 900),
('skill', 'Critical Thinking', true, 700),
('skill', 'Team Collaboration', true, 600),
('skill', 'Time Management', true, 500),
('skill', 'Project Management', true, 400),
('skill', 'Mentoring', true, 300),
('skill', 'Public Speaking', true, 200),
('skill', 'Negotiation', true, 150),
('skill', 'Customer Service', true, 300),
('skill', 'Sales', true, 200),
('skill', 'Marketing', true, 250),
('skill', 'Data Analysis', true, 400),
('skill', 'Business Intelligence', true, 200),
('skill', 'Strategic Planning', true, 150),
('skill', 'Risk Management', true, 100),
('skill', 'Change Management', true, 120),
('skill', 'Conflict Resolution', true, 180),
('skill', 'Decision Making', true, 300)
ON CONFLICT (category, value) DO UPDATE SET 
    usage_count = auto_suggestions.usage_count + EXCLUDED.usage_count,
    updated_at = NOW();

-- ====================================
-- POPULATE WITH COMMON COMPANIES
-- ====================================

INSERT INTO auto_suggestions (category, value, is_global, usage_count) VALUES
-- Tech Companies
('company', 'Google', true, 500),
('company', 'Microsoft', true, 450),
('company', 'Apple', true, 400),
('company', 'Amazon', true, 350),
('company', 'Meta', true, 300),
('company', 'Netflix', true, 200),
('company', 'Uber', true, 150),
('company', 'Airbnb', true, 120),
('company', 'Spotify', true, 100),
('company', 'Twitter', true, 80),
('company', 'LinkedIn', true, 200),
('company', 'Salesforce', true, 150),
('company', 'Adobe', true, 120),
('company', 'Oracle', true, 100),
('company', 'IBM', true, 80),
('company', 'Intel', true, 60),
('company', 'NVIDIA', true, 50),
('company', 'AMD', true, 40),
('company', 'Cisco', true, 70),
('company', 'VMware', true, 60),

-- Financial Companies
('company', 'Goldman Sachs', true, 100),
('company', 'JPMorgan Chase', true, 80),
('company', 'Morgan Stanley', true, 70),
('company', 'Bank of America', true, 60),
('company', 'Citigroup', true, 50),
('company', 'Wells Fargo', true, 40),
('company', 'American Express', true, 30),
('company', 'PayPal', true, 80),
('company', 'Stripe', true, 100),
('company', 'Square', true, 60),

-- Consulting Companies
('company', 'McKinsey & Company', true, 80),
('company', 'Bain & Company', true, 60),
('company', 'Boston Consulting Group', true, 70),
('company', 'Deloitte', true, 100),
('company', 'PwC', true, 90),
('company', 'EY', true, 80),
('company', 'KPMG', true, 70),
('company', 'Accenture', true, 120),
('company', 'Capgemini', true, 60),
('company', 'Infosys', true, 50),

-- Startups & Unicorns
('company', 'Stripe', true, 100),
('company', 'Shopify', true, 80),
('company', 'Slack', true, 70),
('company', 'Zoom', true, 60),
('company', 'DoorDash', true, 50),
('company', 'Instacart', true, 40),
('company', 'Robinhood', true, 30),
('company', 'Coinbase', true, 40),
('company', 'Palantir', true, 30),
('company', 'Snowflake', true, 50)
ON CONFLICT (category, value) DO UPDATE SET 
    usage_count = auto_suggestions.usage_count + EXCLUDED.usage_count,
    updated_at = NOW();

-- ====================================
-- POPULATE WITH COMMON LOCATIONS
-- ====================================

INSERT INTO auto_suggestions (category, value, is_global, usage_count) VALUES
-- US Cities
('location', 'San Francisco, CA', true, 800),
('location', 'New York, NY', true, 700),
('location', 'Seattle, WA', true, 500),
('location', 'Austin, TX', true, 400),
('location', 'Boston, MA', true, 350),
('location', 'Los Angeles, CA', true, 300),
('location', 'Chicago, IL', true, 250),
('location', 'Denver, CO', true, 200),
('location', 'Atlanta, GA', true, 180),
('location', 'Miami, FL', true, 150),
('location', 'Portland, OR', true, 120),
('location', 'Nashville, TN', true, 100),
('location', 'Raleigh, NC', true, 80),
('location', 'Charlotte, NC', true, 70),
('location', 'Dallas, TX', true, 60),
('location', 'Houston, TX', true, 50),
('location', 'Phoenix, AZ', true, 40),
('location', 'Las Vegas, NV', true, 30),
('location', 'San Diego, CA', true, 60),
('location', 'San Jose, CA', true, 80),

-- UK Cities
('location', 'London, UK', true, 600),
('location', 'Manchester, UK', true, 200),
('location', 'Birmingham, UK', true, 150),
('location', 'Edinburgh, UK', true, 120),
('location', 'Glasgow, UK', true, 100),
('location', 'Leeds, UK', true, 80),
('location', 'Liverpool, UK', true, 70),
('location', 'Bristol, UK', true, 60),
('location', 'Cardiff, UK', true, 50),
('location', 'Newcastle, UK', true, 40),

-- European Cities
('location', 'Berlin, Germany', true, 300),
('location', 'Amsterdam, Netherlands', true, 250),
('location', 'Paris, France', true, 200),
('location', 'Barcelona, Spain', true, 150),
('location', 'Madrid, Spain', true, 120),
('location', 'Rome, Italy', true, 100),
('location', 'Milan, Italy', true, 80),
('location', 'Vienna, Austria', true, 70),
('location', 'Zurich, Switzerland', true, 60),
('location', 'Stockholm, Sweden', true, 50),
('location', 'Copenhagen, Denmark', true, 40),
('location', 'Oslo, Norway', true, 30),
('location', 'Helsinki, Finland', true, 30),
('location', 'Dublin, Ireland', true, 100),
('location', 'Brussels, Belgium', true, 60),
('location', 'Luxembourg', true, 40),

-- Canadian Cities
('location', 'Toronto, ON', true, 200),
('location', 'Vancouver, BC', true, 150),
('location', 'Montreal, QC', true, 120),
('location', 'Calgary, AB', true, 80),
('location', 'Ottawa, ON', true, 60),
('location', 'Edmonton, AB', true, 50),
('location', 'Quebec City, QC', true, 40),
('location', 'Winnipeg, MB', true, 30),

-- Remote Options
('location', 'Remote', true, 1000),
('location', 'Remote (US)', true, 800),
('location', 'Remote (UK)', true, 400),
('location', 'Remote (Europe)', true, 300),
('location', 'Remote (Global)', true, 200),
('location', 'Hybrid', true, 600),
('location', 'Hybrid (3 days/week)', true, 200),
('location', 'Hybrid (2 days/week)', true, 150)
ON CONFLICT (category, value) DO UPDATE SET 
    usage_count = auto_suggestions.usage_count + EXCLUDED.usage_count,
    updated_at = NOW();

-- ====================================
-- POPULATE WITH COMMON DEGREES
-- ====================================

INSERT INTO auto_suggestions (category, value, is_global, usage_count) VALUES
-- Computer Science Degrees
('degree', 'Bachelor of Science in Computer Science', true, 800),
('degree', 'Master of Science in Computer Science', true, 400),
('degree', 'PhD in Computer Science', true, 100),
('degree', 'Bachelor of Engineering in Computer Science', true, 300),
('degree', 'Master of Engineering in Computer Science', true, 150),
('degree', 'Bachelor of Technology in Computer Science', true, 200),
('degree', 'Master of Technology in Computer Science', true, 100),

-- Software Engineering Degrees
('degree', 'Bachelor of Science in Software Engineering', true, 400),
('degree', 'Master of Science in Software Engineering', true, 200),
('degree', 'Bachelor of Engineering in Software Engineering', true, 150),
('degree', 'Master of Engineering in Software Engineering', true, 80),

-- Information Technology Degrees
('degree', 'Bachelor of Science in Information Technology', true, 300),
('degree', 'Master of Science in Information Technology', true, 150),
('degree', 'Bachelor of Technology in Information Technology', true, 200),
('degree', 'Master of Technology in Information Technology', true, 100),

-- Data Science Degrees
('degree', 'Bachelor of Science in Data Science', true, 200),
('degree', 'Master of Science in Data Science', true, 150),
('degree', 'Bachelor of Science in Statistics', true, 150),
('degree', 'Master of Science in Statistics', true, 100),
('degree', 'Bachelor of Science in Mathematics', true, 100),
('degree', 'Master of Science in Mathematics', true, 80),

-- Business Degrees
('degree', 'Bachelor of Business Administration', true, 400),
('degree', 'Master of Business Administration', true, 300),
('degree', 'Bachelor of Science in Business Administration', true, 200),
('degree', 'Master of Science in Business Administration', true, 150),
('degree', 'Bachelor of Commerce', true, 150),
('degree', 'Master of Commerce', true, 100),

-- Engineering Degrees
('degree', 'Bachelor of Engineering in Electrical Engineering', true, 200),
('degree', 'Master of Engineering in Electrical Engineering', true, 100),
('degree', 'Bachelor of Engineering in Mechanical Engineering', true, 150),
('degree', 'Master of Engineering in Mechanical Engineering', true, 80),
('degree', 'Bachelor of Engineering in Civil Engineering', true, 100),
('degree', 'Master of Engineering in Civil Engineering', true, 60),

-- Design Degrees
('degree', 'Bachelor of Fine Arts in Graphic Design', true, 150),
('degree', 'Master of Fine Arts in Graphic Design', true, 80),
('degree', 'Bachelor of Design', true, 100),
('degree', 'Master of Design', true, 60),
('degree', 'Bachelor of Arts in Design', true, 80),
('degree', 'Master of Arts in Design', true, 50),

-- Other Technical Degrees
('degree', 'Bachelor of Science in Physics', true, 100),
('degree', 'Master of Science in Physics', true, 60),
('degree', 'Bachelor of Science in Chemistry', true, 80),
('degree', 'Master of Science in Chemistry', true, 50),
('degree', 'Bachelor of Science in Biology', true, 60),
('degree', 'Master of Science in Biology', true, 40),

-- Certifications
('degree', 'AWS Certified Solutions Architect', true, 200),
('degree', 'Google Cloud Professional', true, 150),
('degree', 'Microsoft Certified Azure Developer', true, 120),
('degree', 'Certified Scrum Master', true, 100),
('degree', 'Project Management Professional (PMP)', true, 80),
('degree', 'Certified Information Systems Security Professional (CISSP)', true, 60),
('degree', 'Oracle Certified Professional', true, 50),
('degree', 'Cisco Certified Network Associate (CCNA)', true, 40)
ON CONFLICT (category, value) DO UPDATE SET 
    usage_count = auto_suggestions.usage_count + EXCLUDED.usage_count,
    updated_at = NOW();

-- ====================================
-- CREATE FUNCTIONS FOR AUTO-SUGGESTIONS
-- ====================================

-- Function to add or update a suggestion
CREATE OR REPLACE FUNCTION add_suggestion(
    p_user_id UUID,
    p_category VARCHAR(50),
    p_value TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO auto_suggestions (user_id, category, value, usage_count)
    VALUES (p_user_id, p_category, p_value, 1)
    ON CONFLICT (user_id, category, value) 
    DO UPDATE SET 
        usage_count = auto_suggestions.usage_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get suggestions for a category
CREATE OR REPLACE FUNCTION get_suggestions(
    p_user_id UUID,
    p_category VARCHAR(50),
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    value TEXT,
    usage_count INTEGER,
    is_global BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.value,
        s.usage_count,
        s.is_global
    FROM auto_suggestions s
    WHERE s.category = p_category
    AND (
        s.user_id = p_user_id 
        OR s.is_global = true
    )
    ORDER BY 
        CASE WHEN s.user_id = p_user_id THEN 0 ELSE 1 END, -- User suggestions first
        s.usage_count DESC,
        s.value ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to search suggestions
CREATE OR REPLACE FUNCTION search_suggestions(
    p_user_id UUID,
    p_category VARCHAR(50),
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    value TEXT,
    usage_count INTEGER,
    is_global BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.value,
        s.usage_count,
        s.is_global
    FROM auto_suggestions s
    WHERE s.category = p_category
    AND s.value ILIKE '%' || p_search_term || '%'
    AND (
        s.user_id = p_user_id 
        OR s.is_global = true
    )
    ORDER BY 
        CASE WHEN s.user_id = p_user_id THEN 0 ELSE 1 END, -- User suggestions first
        CASE WHEN s.value ILIKE p_search_term || '%' THEN 0 ELSE 1 END, -- Exact prefix match first
        s.usage_count DESC,
        s.value ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION add_suggestion(UUID, VARCHAR(50), TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_suggestions(UUID, VARCHAR(50), INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION search_suggestions(UUID, VARCHAR(50), TEXT, INTEGER) TO authenticated;

-- Add comment
COMMENT ON TABLE auto_suggestions IS 'Auto-suggestions system for job titles, skills, companies, locations, and degrees. Supports both user-specific and global suggestions with usage tracking.'; 