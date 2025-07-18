# AI Database Setup Guide

## Fix the 404 Database Errors

You're seeing 404 errors because the AI analysis tables haven't been created yet. Here's how to fix it:

## Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: `iqikeltdqmpdsczakril`

## Step 2: Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `database-ai-tables.sql` into the query editor
4. Click **Run** to execute the migration

## Step 3: Verify the Setup

After running the migration, you should see these new tables:
- `ai_analyses` - Stores CV analysis results
- `ai_usage` - Tracks AI usage and costs
- `user_ai_settings` - User preferences for AI analysis
- `profiles` table will have a new `subscription_tier` column

## Step 4: Test the AI System

1. Go to http://localhost:5173/debug/ai
2. Click "Test AI Analysis" - it should work without errors
3. The system will use the fallback provider if no API keys are configured

## Common Issues

- **404 Error**: Tables not created - run the migration
- **403 Error**: RLS policies issue - check user authentication
- **API Key Error**: Normal if no keys configured - fallback system will work

## Next Steps

Once the tables are created, you can:
1. Add API keys to `.env.local` for full AI capabilities
2. Test the AI analysis on the CVs page
3. Configure user subscription tiers

The system is designed to work perfectly even without API keys using the built-in fallback system.
