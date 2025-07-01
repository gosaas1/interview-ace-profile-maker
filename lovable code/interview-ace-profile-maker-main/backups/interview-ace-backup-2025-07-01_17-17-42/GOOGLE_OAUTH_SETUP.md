# Google OAuth Setup Guide

## Quick Setup Steps

### 1. Access Your Supabase Dashboard
- Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sign in and select your project: `iqikeltdqmpdsczakril`

### 2. Get Your Anon Key (IMPORTANT - NEEDED NOW)
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **"anon public"** key 
3. We need to update this in the code

### 3. Configure Google OAuth Provider
1. In your Supabase dashboard, navigate to:
   - **Authentication** → **Providers**
2. Find **Google** in the list and click **Configure**
3. Toggle **Enable sign-in with Google** to ON

### 4. Get Google OAuth Credentials
You need to create OAuth credentials in Google Cloud Console:

#### Option A: Use Existing Credentials (if you had working Google OAuth before)
- Check if you have existing Google Cloud project credentials
- Look for `client_id` and `client_secret` from your previous setup

#### Option B: Create New Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     ```
     https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback
     ```
   - Save and copy the `Client ID` and `Client Secret`

### 5. Configure in Supabase
Back in your Supabase dashboard:
1. Paste your **Google Client ID** 
2. Paste your **Google Client Secret**
3. Click **Save**

### 6. Test the Setup
1. Go to your app: `http://localhost:8080`
2. Click on **Sign In** 
3. Click the **Google** button
4. You should be redirected to Google's OAuth consent screen

## IMMEDIATE ACTION NEEDED

**Please get your anon key from Supabase dashboard and share it so I can update the code.**

The app won't work until we have the correct anon key for project `iqikeltdqmpdsczakril`.

## Quick Test Without Full Setup

If you want to test the dashboard immediately without setting up Google OAuth, you can:
1. Use email/password signup instead of Google OAuth
2. Create a test account with any email/password
3. This should work once we have the correct anon key

Let me know when you have the anon key!

## Current App Configuration

Your app is already configured to handle Google OAuth:
- ✅ OAuth buttons are implemented in `AuthForm.tsx`
- ✅ OAuth callback handling is set up in `AuthCallback.tsx`
- ✅ Supabase client is configured for OAuth
- ✅ Redirect URLs are properly set

## Troubleshooting

### If Google OAuth button doesn't work:
1. Check browser console for errors
2. Verify Supabase project URL and keys
3. Ensure Google OAuth is enabled in Supabase dashboard
4. Check that redirect URI matches exactly

### If you get "OAuth error":
1. Verify Google Client ID and Secret are correct
2. Check that Google+ API is enabled
3. Ensure authorized redirect URIs are set correctly

### Common Issues:
- **"redirect_uri_mismatch"**: The redirect URI in Google Cloud Console doesn't match
- **"invalid_client"**: Wrong Client ID or Client Secret
- **"access_denied"**: User cancelled the OAuth flow

Let me know if you need help with any of these steps! 