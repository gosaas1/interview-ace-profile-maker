# 🔧 CV Creation Endpoint Debug Guide

## 🚨 **Current Issues Identified**

### **1. Authentication Problem**
- **Issue**: `user_id` is ending up as `null` in database
- **Root Cause**: JWT token not being sent properly from frontend OR authentication middleware failing
- **Evidence**: Backend logs show successful API calls but `user_id: null` in saved records

### **2. RLS Policy Conflict**
- **Issue**: RLS policy requires `auth.uid() = user_id` but service role bypasses RLS
- **Root Cause**: Using service role key but still applying RLS policies
- **Impact**: Inserts may fail or create records with null user_id

### **3. Error Handling Issues**
- **Issue**: Generic error messages make debugging difficult
- **Root Cause**: Not enough detailed logging and error codes
- **Impact**: Hard to identify exact failure points

---

## 🛠️ **Solutions Implemented**

### **1. Enhanced CV Creation Endpoint**
✅ **Improved authentication logging**
✅ **Better input validation with specific error codes**
✅ **Detailed database error handling**
✅ **Comprehensive logging at each step**

### **2. Debug Endpoint Added**
✅ **`GET /api/cv/debug-auth`** - Test authentication status
✅ **Shows user object, headers, and authentication state**

### **3. Test Script Created**
✅ **`backend/test-auth.js`** - Automated authentication testing

---

## 🔍 **Step-by-Step Debugging Process**

### **Step 1: Test Authentication**
```bash
# Start backend server
cd backend
npm run server

# In another terminal, test authentication
node test-auth.js
```

### **Step 2: Check Frontend Token**
In your browser's developer tools:
1. Go to **Network** tab
2. Create a CV in your frontend
3. Look for the request to `/api/cv/create`
4. Check if **Authorization** header is present
5. Verify the token format: `Bearer <your-jwt-token>`

### **Step 3: Test Debug Endpoint**
```bash
# Test without auth
curl http://localhost:8000/api/cv/debug-auth

# Test with invalid token
curl -H "Authorization: Bearer invalid-token" http://localhost:8000/api/cv/debug-auth

# Test with valid token (get from frontend)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/cv/debug-auth
```

---

## 📋 **Common Issues & Fixes**

### **Issue 1: "No user found in request"**
**Symptoms**: 401 error with `AUTH_REQUIRED` code
**Causes**:
- Missing Authorization header
- Invalid JWT token format
- Expired JWT token
- Frontend not sending token

**Fix**:
```javascript
// In your frontend API call, ensure you're sending the token:
const response = await fetch('/api/cv/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}` // Make sure this is present
  },
  body: JSON.stringify(cvData)
});
```

### **Issue 2: "Invalid user reference"**
**Symptoms**: 400 error with `INVALID_USER` code
**Causes**:
- User ID doesn't exist in `auth.users` table
- JWT token is for a user that was deleted

**Fix**:
```sql
-- Check if user exists in auth.users
SELECT * FROM auth.users WHERE id = 'your-user-id';
```

### **Issue 3: "Database insert failed"**
**Symptoms**: 500 error with `DATABASE_ERROR` code
**Causes**:
- RLS policy blocking insert
- Missing required fields
- Data type mismatches

**Fix**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'cvs';

-- Temporarily disable RLS for testing (DON'T DO IN PRODUCTION)
ALTER TABLE public.cvs DISABLE ROW LEVEL SECURITY;
```

---

## 🔧 **Frontend Integration Fix**

### **Ensure Proper Token Handling**
```javascript
// In your frontend auth context or API service
const createCV = async (cvData) => {
  const token = await supabase.auth.getSession();
  
  if (!token.data.session?.access_token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch('/api/cv/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.data.session.access_token}`
    },
    body: JSON.stringify(cvData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error);
  }

  return response.json();
};
```

---

## 📊 **Expected Log Output**

### **Successful CV Creation**
```
✅ CV CREATE: User authenticated: { userId: 'uuid-here', email: 'user@example.com' }
✅ CV CREATE: Content normalized successfully
📝 CV CREATE: Attempting database insert with data: { userId: 'uuid-here', title: 'My CV', templateId: 'basic-modern', isPublic: false }
✅ CV CREATE: CV created successfully: { cvId: 'uuid-here', userId: 'uuid-here', title: 'My CV' }
```

### **Authentication Failure**
```
❌ CV CREATE: No user found in request
```

### **Database Error**
```
❌ CV CREATE: Database insert failed: { code: '23503', message: 'insert or update on table "cvs" violates foreign key constraint' }
```

---

## 🎯 **Next Steps**

1. **Run the test script** to identify authentication issues
2. **Check frontend token handling** - ensure JWT is being sent
3. **Verify user exists** in Supabase auth.users table
4. **Test with debug endpoint** to isolate the problem
5. **Check RLS policies** if database inserts are failing

---

## 🆘 **Getting Help**

If you're still having issues:

1. **Run the test script** and share the output
2. **Check browser network tab** for the actual request headers
3. **Share backend logs** when making a CV creation request
4. **Verify your Supabase configuration** (URL, keys, etc.)

The enhanced endpoint will now give you much more detailed error information to help identify the exact issue! 