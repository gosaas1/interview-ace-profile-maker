# CV Upload Backend Setup Guide

## Issues Fixed and Backend Improvements

### 1. Database Schema Issues
- **Fixed**: CV data not saving due to missing required fields
- **Fixed**: Type mismatches between frontend and database schema
- **Improved**: Better data extraction from uploaded files (email, phone, location, skills)

### 2. Storage Bucket Issues
- **Fixed**: Storage bucket creation and file upload failures
- **Added**: Automatic bucket creation with proper permissions
- **Added**: Fallback bucket handling for better reliability

### 3. CV Operations Enhancement
- **Improved**: Better error handling and logging
- **Added**: Comprehensive data validation
- **Fixed**: TypeScript type compatibility issues

## Setup Instructions

### Step 1: Database Setup

1. **Open your Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `iqikeltdqmpdsczakril`

2. **Run Database Setup**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `database-setup.sql` (in your project root)
   - Paste and run the SQL script
   - This will create all necessary tables and policies

### Step 2: Storage Bucket Setup

1. **Go to Storage in Supabase Dashboard**
2. **Create a new bucket named `cvs`**:
   - Name: `cvs`
   - Public: Yes (checked)
   - File size limit: 10MB
   - Allowed MIME types: `application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain`

3. **Set Bucket Policies** (if needed):
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Users can upload CV files" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'cvs' AND auth.role() = 'authenticated');
   
   -- Allow users to view their own files
   CREATE POLICY "Users can view own CV files" ON storage.objects
   FOR SELECT USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Step 3: Test the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Go to http://localhost:8080
   - Try to sign up/sign in with Google OAuth or email
   - Verify you can access the dashboard

3. **Test CV Upload**:
   - Go to the home page
   - Click "Build My CV Now" or "Start Free"
   - Choose "Upload Existing CV"
   - Try uploading a PDF or DOCX file
   - Check if the CV appears in the "My CVs" section

### Step 4: Debugging Issues

If CV upload still doesn't work, check these:

1. **Browser Console Logs**:
   - Open Developer Tools (F12)
   - Check for any error messages during upload
   - Look for authentication or permission errors

2. **Supabase Logs**:
   - Go to Logs section in Supabase Dashboard
   - Check for database insert errors or storage upload errors

3. **Common Issues**:
   
   **Authentication Error**:
   ```
   Error: User not authenticated
   ```
   - Solution: Make sure you're logged in and the session is valid
   
   **Storage Error**:
   ```
   Error: Failed to upload file to any storage bucket
   ```
   - Solution: Check if the `cvs` bucket exists and has proper permissions
   
   **Database Error**:
   ```
   Error: Failed to save CV: [database error]
   ```
   - Solution: Verify the database schema is set up correctly

## What's Improved in the Code

### 1. Enhanced CV Upload Modal (`src/components/cv/CVUploadModal.tsx`)
- Better file validation and error handling
- Improved text extraction from DOCX files
- Enhanced data parsing (email, phone, location, skills extraction)
- Proper TypeScript typing
- Better user feedback with loading states

### 2. Improved Supabase Operations (`src/lib/supabase.ts`)
- Enhanced `cvOperations.createCV()` with better data validation
- New `storageOperations` for file uploads
- Automatic bucket creation
- Better error handling and logging

### 3. Database Schema (`database-setup.sql`)
- Complete table structure for CVs, jobs, interviews
- Proper Row Level Security (RLS) policies
- Indexes for better performance
- Triggers for automatic timestamps

## Testing Checklist

- [ ] Database tables created successfully
- [ ] Storage bucket `cvs` exists and is public
- [ ] Authentication working (Google OAuth + Email)
- [ ] Can access dashboard after login
- [ ] Can upload PDF files
- [ ] Can upload DOCX files
- [ ] Can paste CV text directly
- [ ] CVs appear in "My CVs" section
- [ ] Can view/edit/delete CVs
- [ ] File URLs are accessible

## Next Steps

Once the backend is working:
1. Test with different file types (PDF, DOCX, TXT)
2. Verify data extraction quality
3. Test CV preview and editing functionality
4. Ensure all CRUD operations work properly

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs
3. Verify your database schema matches the setup file
4. Ensure storage permissions are correct

The CV upload functionality should now work properly with improved error handling, better data extraction, and more reliable storage operations. 