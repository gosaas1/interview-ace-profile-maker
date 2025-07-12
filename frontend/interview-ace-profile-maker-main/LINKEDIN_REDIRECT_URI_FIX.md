# LinkedIn OAuth Redirect URI Fix

## Problem
Users are getting **400 Bad Request** errors when trying to authenticate with LinkedIn from the main auth page (`/auth`), even though it works from debug/test pages.

## Root Cause
The redirect URI in your LinkedIn Developer App doesn't exactly match what Supabase is sending in the OAuth request.

## Solution

### Step 1: Get the Exact Supabase Callback URL
Your Supabase callback URL is:
```
https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback
```

### Step 2: Update LinkedIn Developer App
1. **Go to LinkedIn Developer Console:**
   - Visit: https://www.linkedin.com/developers/apps
   - Find your app with Client ID: `788zhq2xugi6vm`

2. **Navigate to Auth Tab:**
   - Click on your app
   - Go to the "Auth" tab

3. **Update Redirect URLs:**
   - **Remove any existing redirect URLs**
   - **Add this EXACT URL:**
     ```
     https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback
     ```
   - **Make sure there are NO trailing slashes or extra characters**

4. **Save Changes**

### Step 3: Verify LinkedIn App Settings
Make sure your LinkedIn app has:
- ✅ **Client ID:** `788zhq2xugi6vm`
- ✅ **Client Secret:** `WPL_AP1.G7ptuYeCirVKnM7O.l2OPUw==`
- ✅ **Redirect URL:** `https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback`
- ✅ **Products:** "Sign In with LinkedIn using OpenID Connect" (should be approved)

### Step 4: Test the Fix
1. Go to your app: `http://localhost:8080/auth`
2. Click the LinkedIn button
3. You should now be redirected to LinkedIn without 400 error
4. Complete the authentication flow

## Alternative Solution (if above doesn't work)

If you're still getting 400 errors, try adding BOTH redirect URLs:

1. **Primary (Supabase):**
   ```
   https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback
   ```

2. **Secondary (Your app):**
   ```
   http://localhost:8080/auth/callback
   ```

## Common Issues & Fixes

### Issue 1: Multiple Redirect URLs
- **Problem:** Having multiple redirect URLs can sometimes cause conflicts
- **Fix:** Use only the Supabase callback URL

### Issue 2: Trailing Slashes
- **Problem:** `https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback/` (with trailing slash)
- **Fix:** Remove the trailing slash: `https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback`

### Issue 3: HTTP vs HTTPS
- **Problem:** Using HTTP instead of HTTPS
- **Fix:** Always use HTTPS for production Supabase URLs

### Issue 4: LinkedIn App Not Approved
- **Problem:** LinkedIn app still pending approval
- **Fix:** Check your LinkedIn Developer Console for app status

## Testing Steps

After making changes:

1. **Wait 5-10 minutes** for LinkedIn changes to propagate
2. **Clear your browser cache** or use incognito mode
3. **Test from main auth page:** `http://localhost:8080/auth`
4. **Check browser network tab** for any remaining 400 errors

## Expected Flow After Fix

1. ✅ User clicks LinkedIn button on `/auth`
2. ✅ Redirected to LinkedIn (no 400 error)
3. ✅ User grants permissions
4. ✅ LinkedIn redirects back to Supabase callback
5. ✅ Supabase exchanges code for session
6. ✅ User redirected to `/auth/callback`
7. ✅ AuthCallback processes the session
8. ✅ User redirected to dashboard

## Verification

You'll know it's working when:
- ✅ No 400 Bad Request errors in browser console
- ✅ LinkedIn authorization page loads correctly
- ✅ Users can complete the full authentication flow
- ✅ Users are successfully redirected to dashboard after LinkedIn auth 