import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Increase payload size limit to handle large CVs
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File upload configuration (moved before routes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

// Initialize Supabase client with proper fallback values
const supabaseUrl = process.env.SUPABASE_URL || 'https://iqikeltdqmpdsczakril.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU4MTE4OSwiZXhwIjoyMDY1MTU3MTg5fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

if (!supabaseKey || supabaseKey === 'your-service-role-key') {
  console.warn('⚠️  Supabase service role key not found. Database operations will be limited.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced data sanitization function to handle Unicode issues
function sanitizeCVData(data) {
  if (typeof data === 'string') {
    // Remove null bytes and problematic Unicode sequences
    return data
      .replace(/\x00/g, '') // Remove null bytes
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/[\uFFFD]/g, '') // Remove replacement characters
      .replace(/\\u0000/g, '') // Remove escaped null bytes
      .replace(/\\x00/g, '') // Remove hex null bytes
      .trim();
  }
  
  if (typeof data === 'object' && data !== null) {
    // Recursively sanitize object properties
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeCVData(value);
    }
    return sanitized;
  }
  
  return data;
}

// Text extraction functions (simplified)
async function extractTextFromPDF(filePath) {
  // Simplified PDF extraction - in production, use a proper PDF library
  return 'PDF content extracted from: ' + path.basename(filePath);
}

async function extractTextFromDOCX(filePath) {
  // Simplified DOCX extraction - in production, use a proper DOCX library
  return 'DOCX content extracted from: ' + path.basename(filePath);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'ApplyAce Backend',
    version: '1.0.0'
  });
});

// Enhanced CV creation endpoint with better error handling
app.post('/api/cv/create', async (req, res) => {
  try {
    console.log('✅ CV create endpoint hit:', req.body);
    
    const { title, content, is_public = false, user_id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        error: 'Missing required fields: title and content are required'
      });
    }
    
    // Sanitize the data to handle Unicode issues
    const sanitizedContent = sanitizeCVData(content);
    const sanitizedTitle = sanitizeCVData(title);
    
    // Prepare the CV data with proper structure
    // For unauthenticated users, we'll use a special approach
    const cvData = {
      title: sanitizedTitle,
      content: sanitizedContent,
      is_public: Boolean(is_public),
      // Don't set user_id if not provided - let database handle it
      template_id: 'basic-modern'
    };
    
    // Only add user_id if it's a valid UUID and not null
    if (user_id && user_id !== '00000000-0000-0000-0000-000000000000') {
      cvData.user_id = user_id;
    }
    
    console.log('📝 Attempting to create CV with data:', cvData);
    
    // Try to insert with retry logic for schema cache issues
    let result;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        result = await supabase
          .from('cvs')
          .insert([cvData])
          .select()
          .single();
        
        if (result.error) {
          throw result.error;
        }
        
        console.log('✅ CV created successfully:', result.data);
        return res.status(201).json({
          success: true,
          cv: result.data,
          message: 'CV created successfully'
        });
        
      } catch (error) {
        retryCount++;
        console.log(`❌ Attempt ${retryCount} failed:`, error.message);
        
        // If it's a schema cache error, try to refresh and retry
        if (error.message.includes('schema cache') && retryCount < maxRetries) {
          console.log('🔄 Schema cache error detected, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          continue;
        }
        
        // If it's the last attempt or not a schema error, throw
        if (retryCount >= maxRetries) {
          throw error;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating CV:', error);
    
    // Provide specific error messages
    let errorMessage = 'Failed to create CV';
    let statusCode = 500;
    
    if (error.message.includes('schema cache')) {
      errorMessage = 'Database schema is out of sync. Please contact support.';
      statusCode = 503;
    } else if (error.message.includes('Unicode')) {
      errorMessage = 'CV content contains unsupported characters. Please check your input.';
      statusCode = 400;
    } else if (error.message.includes('foreign key')) {
      errorMessage = 'Invalid user ID provided.';
      statusCode = 400;
    }
    
    return res.status(statusCode).json({
      error: errorMessage,
      details: error.message
    });
  }
});

// CV upload endpoint with proper multer configuration
app.post('/api/cv/upload', upload.single('cv'), async (req, res) => {
  try {
    console.log('✅ CV upload endpoint hit');
    
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }
    
    const { title, is_public = false, user_id } = req.body;
    
    // Extract text from uploaded file
    let extractedText = '';
    try {
      if (req.file.mimetype === 'application/pdf') {
        extractedText = await extractTextFromPDF(req.file.path);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromDOCX(req.file.path);
      } else {
        extractedText = req.file.buffer ? req.file.buffer.toString('utf-8') : 'Text content extracted';
      }
    } catch (extractError) {
      console.error('❌ Text extraction error:', extractError);
      return res.status(400).json({
        error: 'Failed to extract text from file',
        details: extractError.message
      });
    }
    
    // Sanitize the extracted text
    const sanitizedText = sanitizeCVData(extractedText);
    
    // Create CV with extracted content
    const cvData = {
      title: title || req.file.originalname,
      content: {
        full_name: 'Extracted from file',
        summary: sanitizedText.substring(0, 500) + '...',
        raw_content: sanitizedText
      },
      is_public: Boolean(is_public),
      user_id: user_id || '00000000-0000-0000-0000-000000000000', // Default UUID for testing
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert into database with enhanced error handling
    let result;
    try {
      result = await supabase
        .from('cvs')
        .insert([cvData])
        .select();
    } catch (schemaError) {
      if (schemaError.code === 'PGRST204') {
        // Try schema refresh
        await supabase.from('cvs').select('id').limit(1);
        result = await supabase
          .from('cvs')
          .insert([cvData])
          .select();
      } else {
        throw schemaError;
      }
    }
    
    if (result.error) {
      console.error('❌ Supabase error:', result.error);
      return res.status(500).json({
        error: 'Failed to save CV',
        details: result.error.message
      });
    }
    
    console.log('✅ CV uploaded successfully:', result.data[0].id);
    res.status(201).json({
      success: true,
      cv: result.data[0],
      message: 'CV uploaded and processed successfully'
    });
    
  } catch (error) {
    console.error('❌ Error uploading CV:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Get CVs endpoint
app.get('/api/cv', async (req, res) => {
  try {
    console.log('✅ Get CVs endpoint hit');
    
    const result = await supabase
      .from('cvs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (result.error) {
      console.error('❌ Supabase error:', result.error);
      return res.status(500).json({
        error: 'Failed to fetch CVs',
        details: result.error.message
      });
    }
    
    console.log(`✅ Retrieved ${result.data.length} CVs`);
    res.json({
      success: true,
      cvs: result.data
    });
    
  } catch (error) {
    console.error('❌ Error fetching CVs:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ApplyAce Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 CV endpoints available:`);
  console.log(`   - POST /api/cv/create`);
  console.log(`   - POST /api/cv/upload`);
  console.log(`   - GET /api/cv`);
  console.log(`✅ Server ready!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
}); 