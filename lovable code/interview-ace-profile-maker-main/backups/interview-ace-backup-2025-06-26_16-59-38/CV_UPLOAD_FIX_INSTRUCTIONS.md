# CV Upload Fix Instructions

## Issue
The CV upload is failing because the database is missing required columns. The error messages show:
- `"Could not find the 'is_primary' column of 'cvs' in the schema cache"`
- `"Could not find the 'file_url' column of 'cvs' in the schema cache"`

## Solution

### Step 1: Run the Complete Migration Script
1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-migration-complete.sql`
4. Click "Run" to execute the script

### Step 2: Verify the Fix
After running the migration:
1. The script will show you the current table structure
2. Add all missing columns (`template_id`, `is_primary`, `ats_score`, `file_url`, `file_name`, `file_size`, `content_type`)
3. Force refresh the schema cache
4. Show the final table structure to confirm all columns exist

### Step 3: Test CV Upload
1. Go back to your application
2. Try uploading a CV file
3. The upload should now work successfully

## What the Fix Does
- **Adds missing columns** to the `cvs` table
- **Forces schema cache refresh** so Supabase recognizes the new columns
- **Provides fallback logic** in the code to use simplified CV creation if needed
- **Better error handling** to gracefully handle database schema issues

## Backup Plan
If the migration doesn't work completely, the code now has a fallback that will:
1. Try to create the CV with all fields
2. If that fails due to missing columns, automatically retry with only the core fields
3. This ensures CV upload works even if some columns are missing

Just run the SQL script and your CV upload should work! 