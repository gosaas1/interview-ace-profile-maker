# 🔗 LinkedIn OAuth Setup Guide

## 📋 Overview
This guide will help you set up LinkedIn OAuth authentication for the ApplyAce application using Supabase.

## 🚀 Step 1: Create LinkedIn App

### 1.1 Go to LinkedIn Developer Portal
- Visit [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
- Sign in with your LinkedIn account
- Click "Create App"

### 1.2 App Configuration
```
App Name: ApplyAce Career Platform
LinkedIn Page: [Your Company/Personal Page]
App Logo: [Upload your logo]
Legal Agreement: ✅ Accept
```

### 1.3 Products & Permissions
Request access to these LinkedIn API products:
- **Sign In with LinkedIn using OpenID Connect** (Required)
- **LinkedIn Learning** (Optional - for course recommendations)
- **Advertising API** (Optional - for job posting features)

## 🔧 Step 2: Configure OAuth Settings

### 2.1 OAuth 2.0 Settings
```
Authorized Redirect URLs:
- https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback
- https://your-production-domain.com/auth/callback
- http://localhost:8080/auth/callback (for development)
```

### 2.2 Required Scopes
```
- openid
- profile
- email
```

## 🔑 Step 3: Get Credentials

### 3.1 Client Credentials
After creating your app, you'll receive:
```
Client ID: [Your LinkedIn Client ID]
Client Secret: [Your LinkedIn Client Secret]
```

## ⚙️ Step 4: Configure Supabase

### 4.1 Navigate to Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `iqikeltdqmpdsczakril`
3. Go to **Authentication** > **Providers**

### 4.2 Enable LinkedIn Provider
1. Find "LinkedIn" in the providers list
2. Toggle **Enable** to ON
3. Enter your credentials:
```
Client ID: [Your LinkedIn Client ID from Step 3.1]
Client Secret: [Your LinkedIn Client Secret from Step 3.1]
```

### 4.3 Advanced Settings (Optional)
```
Scopes: openid profile email
```

## 🧪 Step 5: Test Integration

### 5.1 Development Testing
1. Run your development server: `npm run dev`
2. Navigate to `/auth`
3. Click the "LinkedIn" button
4. Complete OAuth flow
5. Check if user data is properly stored

### 5.2 Verify User Data
After successful authentication, check:
- User profile created in Supabase
- Email and name populated correctly
- LinkedIn provider ID stored

## 🔍 Step 6: Troubleshooting

### Common Issues & Solutions

#### Issue: "OAuth not configured"
**Solution**: Ensure LinkedIn provider is enabled in Supabase Dashboard

#### Issue: "Invalid redirect URI"
**Solution**: 
- Check redirect URLs in LinkedIn app settings
- Ensure Supabase callback URL is correct: `https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback`

#### Issue: "Insufficient permissions"
**Solution**: 
- Request proper LinkedIn API products
- Wait for LinkedIn approval (can take 1-3 business days)

#### Issue: "Email not returned"
**Solution**:
- Ensure email scope is requested
- LinkedIn users must have verified email addresses

## 📊 Step 7: Production Deployment

### 7.1 Update Redirect URLs
When deploying to production, add your production domains:
```
- https://your-production-domain.com/auth/callback
- https://your-app.vercel.app/auth/callback
```

### 7.2 Environment Variables
Ensure these are set in production:
```
VITE_SUPABASE_URL=https://iqikeltdqmpdsczakril.supabase.co
VITE_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
```

## 🎯 Expected User Flow

1. **User clicks "Sign in with LinkedIn"**
2. **Redirect to LinkedIn OAuth**
3. **User authorizes ApplyAce app**
4. **LinkedIn redirects back to Supabase**
5. **Supabase processes OAuth response**
6. **User redirected to `/auth/callback`**
7. **AuthCallback component handles final steps**
8. **User lands on dashboard**

## 📋 Verification Checklist

- [ ] LinkedIn app created and approved
- [ ] OAuth redirect URLs configured
- [ ] Supabase LinkedIn provider enabled
- [ ] Client credentials entered in Supabase
- [ ] Development testing successful
- [ ] User data properly stored
- [ ] Production URLs configured
- [ ] Error handling working

## 🚨 Security Notes

1. **Never commit LinkedIn credentials to version control**
2. **Use environment variables for sensitive data**
3. **Regularly rotate client secrets**
4. **Monitor OAuth usage in LinkedIn dashboard**
5. **Implement proper error handling for OAuth failures**

---

## 📞 Support

If you encounter issues:
1. Check LinkedIn Developer Console for errors
2. Review Supabase Auth logs
3. Test OAuth flow step by step
4. Contact LinkedIn Developer Support if needed

**Last Updated**: December 2024
**Status**: Ready for Implementation 