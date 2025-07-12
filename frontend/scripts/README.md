# Database Setup for One Button Apply Feature

## Overview
This directory contains SQL scripts to set up the database tables and fields required for the One Button Apply feature.

## Required Database Changes

### 1. Run the Setup Script
Execute the following SQL script in your Supabase SQL editor:

```sql
-- Run this in Supabase SQL Editor
\i scripts/setup-one-button-apply-database.sql
```

Or copy and paste the contents of `setup-one-button-apply-database.sql` directly into your Supabase SQL editor.

### 2. Tables Created/Modified

#### New Tables:
- **`job_applications`** - Stores job application details
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `job_title` (text, required)
  - `company` (text, required)
  - `location` (text)
  - `job_url` (text)
  - `job_description` (text)
  - `match_score` (integer, 0-100)
  - `status` (text: draft, applied, interview, rejected, offer)
  - `applied_at` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **`cover_letters`** - Stores generated cover letters
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `cv_id` (uuid, references cvs)
  - `job_application_id` (uuid, references job_applications)
  - `content` (text, required)
  - `is_ai_generated` (boolean, default true)
  - `ai_model` (text, default 'gpt-4o-mini')
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

#### Modified Tables:
- **`cvs`** - Added new fields:
  - `job_application_id` (uuid, references job_applications)
  - `is_tailored` (boolean, default false)
  - `tailored_for_job` (text)
  - `ai_model` (text, default 'gpt-4o-mini')

### 3. Database View
- **`job_applications_with_content`** - A view that joins all related data for easy querying

### 4. Security
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own data
- Proper indexes for performance

### 5. Triggers
- Automatic `updated_at` timestamp updates

## Verification

After running the setup script, you should see:
```
One Button Apply database setup completed successfully!
```

## Testing

You can test the setup by:

1. **Creating a test application** through the One Button Apply feature
2. **Checking the dashboard** to see if applications appear
3. **Verifying data persistence** by refreshing the page

## Troubleshooting

### Common Issues:

1. **Permission Errors**: Ensure you're running the script as a database owner
2. **Foreign Key Errors**: Make sure the `cvs` table exists before running the script
3. **RLS Policy Errors**: The script includes DROP statements to avoid conflicts

### Manual Verification:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('job_applications', 'cover_letters');

-- Check if view exists
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'job_applications_with_content';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('job_applications', 'cover_letters');
```

## Rollback

If you need to rollback the changes:

```sql
-- Drop the view
DROP VIEW IF EXISTS job_applications_with_content;

-- Drop the tables
DROP TABLE IF EXISTS cover_letters CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;

-- Remove added columns from cvs table
ALTER TABLE cvs 
DROP COLUMN IF EXISTS job_application_id,
DROP COLUMN IF EXISTS is_tailored,
DROP COLUMN IF EXISTS tailored_for_job,
DROP COLUMN IF EXISTS ai_model;
``` 