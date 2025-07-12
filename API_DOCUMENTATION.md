# 🔌 APPLYACE API DOCUMENTATION

## 📋 **API OVERVIEW**

**Base URL**: `http://localhost:8000` (Development)
**Authentication**: Bearer Token (Supabase JWT)
**Content-Type**: `application/json`

---

## 🔐 **AUTHENTICATION**

### **Headers Required**
```http
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
```

### **Getting Auth Token**
```typescript
// From Supabase client
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## 📄 **CV MANAGEMENT API**

### **Create CV**
```http
POST /api/cv/create
```

**Request Body:**
```json
{
  "title": "Software Engineer CV",
  "content": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "London, UK",
    "summary": "Experienced software engineer...",
    "experiences": [
      {
        "company": "Tech Corp",
        "role": "Senior Developer",
        "duration": "2020-2023",
        "description": "Led development team..."
      }
    ],
    "education": [
      {
        "institution": "University of London",
        "degree": "Computer Science",
        "year": "2020",
        "gpa": "3.8"
      }
    ],
    "skills": "JavaScript, React, Node.js",
    "certifications": "AWS Certified Developer"
  },
  "is_public": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "title": "Software Engineer CV",
  "content": { /* CV data */ },
  "template_id": "basic-modern",
  "is_public": false,
  "created_at": "2025-01-08T14:30:00Z",
  "updated_at": "2025-01-08T14:30:00Z"
}
```

### **Get All CVs**
```http
GET /api/cv
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "user_uuid",
    "title": "Software Engineer CV",
    "content": { /* CV data */ },
    "template_id": "basic-modern",
    "is_public": false,
    "created_at": "2025-01-08T14:30:00Z",
    "updated_at": "2025-01-08T14:30:00Z"
  }
]
```

### **Get Specific CV**
```http
GET /api/cv/:id
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "title": "Software Engineer CV",
  "content": { /* CV data */ },
  "template_id": "basic-modern",
  "is_public": false,
  "created_at": "2025-01-08T14:30:00Z",
  "updated_at": "2025-01-08T14:30:00Z"
}
```

### **Update CV**
```http
PUT /api/cv/:id
```

**Request Body:**
```json
{
  "title": "Updated CV Title",
  "content": { /* Updated CV data */ },
  "is_public": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "title": "Updated CV Title",
  "content": { /* Updated CV data */ },
  "template_id": "basic-modern",
  "is_public": true,
  "created_at": "2025-01-08T14:30:00Z",
  "updated_at": "2025-01-08T14:35:00Z"
}
```

### **Delete CV**
```http
DELETE /api/cv/:id
```

**Response:**
```http
204 No Content
```

---

## 📤 **FILE UPLOAD API**

### **Upload CV File**
```http
POST /api/cv/upload
Content-Type: multipart/form-data
```

**Request Body:**
```form-data
file: [PDF/DOCX/TXT file]
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "title": "uploaded-cv.pdf",
  "content": {
    "full_name": "Extracted Name",
    "email": "extracted@email.com",
    "summary": "Extracted summary...",
    "experiences": [ /* Extracted experiences */ ],
    "education": [ /* Extracted education */ ],
    "skills": "Extracted skills",
    "file_name": "uploaded-cv.pdf",
    "file_content": "Raw file content"
  },
  "template_id": null,
  "is_public": false,
  "created_at": "2025-01-08T14:30:00Z",
  "updated_at": "2025-01-08T14:30:00Z"
}
```

---

## 🔐 **AUTHENTICATION API**

### **Email/Password Login**
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_uuid",
    "email": "user@example.com",
    "created_at": "2025-01-08T14:30:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### **User Registration**
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "New User"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_uuid",
    "email": "newuser@example.com",
    "created_at": "2025-01-08T14:30:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### **Get User Profile**
```http
GET /api/auth/profile
```

**Response:**
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2025-01-08T14:30:00Z",
  "updated_at": "2025-01-08T14:30:00Z"
}
```

---

## 💳 **PAYMENT API (Stripe)**

### **Create Checkout Session**
```http
POST /api/stripe/create-checkout-session
```

**Request Body:**
```json
{
  "priceId": "price_1234567890",
  "userId": "user_uuid",
  "successUrl": "http://localhost:3000/payment-success",
  "cancelUrl": "http://localhost:3000/payment-failed"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_1234567890",
  "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
}
```

### **Stripe Webhook**
```http
POST /api/stripe/webhook
Content-Type: application/json
```

**Headers:**
```http
Stripe-Signature: t=1234567890,v1=signature
```

---

## 🏥 **HEALTH CHECK API**

### **Server Health**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "ApplyAce Backend Server Running",
  "stripe_configured": true,
  "timestamp": "2025-01-08T14:30:00Z"
}
```

---

## 📊 **DATA STRUCTURES**

### **CV Data Interface**
```typescript
interface CVData {
  id: string;
  user_id: string;
  title: string;
  content: {
    full_name: string;
    job_title?: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url?: string;
    portfolio_url?: string;
    summary: string;
    experiences: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      year: string;
      gpa: string;
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies: string;
      url: string;
    }>;
    skills: string;
    languages?: Array<{
      language: string;
      proficiency: string;
    }>;
    certifications: string;
    references?: Array<{
      name: string;
      title: string;
      company: string;
      email: string;
      phone: string;
    }>;
  };
  template_id?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
```

### **User Data Interface**
```typescript
interface UserData {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}
```

---

## 🚨 **ERROR RESPONSES**

### **Standard Error Format**
```json
{
  "error": "Error message description",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

### **Common Error Codes**
```typescript
// Authentication Errors
401: "Unauthorized - Invalid or missing token"
403: "Forbidden - Insufficient permissions"

// Validation Errors
400: "Bad Request - Invalid input data"
422: "Unprocessable Entity - Validation failed"

// Resource Errors
404: "Not Found - Resource doesn't exist"
409: "Conflict - Resource already exists"

// Server Errors
500: "Internal Server Error - Something went wrong"
503: "Service Unavailable - Service temporarily unavailable"
```

### **Example Error Responses**

**Authentication Error:**
```json
{
  "error": "User not authenticated",
  "code": "AUTH_REQUIRED"
}
```

**Validation Error:**
```json
{
  "error": "Invalid CV data",
  "details": "Missing required field: full_name",
  "code": "VALIDATION_ERROR"
}
```

**Resource Not Found:**
```json
{
  "error": "CV not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

---

## 🔧 **TESTING ENDPOINTS**

### **Test Database Connection**
```http
GET /api/debug/database
```

**Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "timestamp": "2025-01-08T14:30:00Z"
}
```

### **Test Authentication**
```http
GET /api/debug/auth
```

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_uuid",
    "email": "user@example.com"
  }
}
```

---

## 📈 **RATE LIMITING**

### **Limits**
- **General API**: 100 requests per 15 minutes per IP
- **File Upload**: 10 uploads per 15 minutes per user
- **Authentication**: 5 attempts per 15 minutes per IP

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641654000
```

---

## 🔒 **SECURITY CONSIDERATIONS**

### **CORS Configuration**
```typescript
// Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://applyace.com'
];
```

### **Input Validation**
- All inputs validated with Zod schemas
- SQL injection prevention with parameterized queries
- XSS protection with content sanitization

### **File Upload Security**
- File type validation (PDF, DOCX, TXT only)
- File size limits (10MB max)
- Virus scanning (if configured)

---

**Last Updated**: January 8, 2025
**API Version**: 1.0.0
**Status**: Production Ready 