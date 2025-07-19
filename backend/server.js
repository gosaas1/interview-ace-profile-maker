import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import TypeScript-based routes and auth middleware (compiled to dist)
import cvRouter from './dist/routes/cv.js';
import adminRouter from './dist/routes/admin.js';
import analyticsRouter from './dist/routes/analytics.js';
import jobsRouter from './dist/routes/jobs.js';
import interviewRouter from './dist/routes/interview.js';
import authRouter from './dist/routes/auth.js';
import { authenticateUser } from './dist/middleware/auth.js';

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

// Initialize Supabase client with proper fallback values
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey || supabaseKey === 'your-service-role-key') {
  console.warn('⚠️  Supabase service role key not found. Database operations will be limited.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── MOUNT ALL ROUTERS ──────────────────────────────────────────────────────
// All API routes now go through the TypeScript routers with proper auth
app.use('/api/cv', cvRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/auth', authRouter);
// ─────────────────────────────────────────────────────────────────────────────

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

// CV upload endpoint with proper multer configuration (keeping this for now)
app.post('/api/cv/upload', authenticateUser, upload.single('cv'), async (req, res) => {
  try {
    console.log('✅ CV upload endpoint hit');
    
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }
    
    const { title, is_public = false } = req.body;
    
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
    
    // Create CV with extracted content
    const cvData = {
      user_id: req.user.id, // Use authenticated user ID
      title: title || req.file.originalname,
      content: {
        full_name: 'Extracted from file',
        summary: extractedText.substring(0, 500) + '...',
        raw_content: extractedText
      },
      is_public: Boolean(is_public),
      content_type: 'upload',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert into database with enhanced error handling
    const { data: cvRecord, error } = await supabase
      .from('cvs')
      .insert([cvData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        error: 'Failed to save CV',
        details: error.message
      });
    }
    
    console.log('✅ CV uploaded successfully:', cvRecord.id);
    res.status(201).json({
      success: true,
      cv: cvRecord,
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
  console.log(`   - POST /api/cv/create (authenticated via TypeScript router)`);
  console.log(`   - POST /api/cv/upload (authenticated)`);
  console.log(`   - GET /api/cv/debug-auth (authenticated via TypeScript router)`);
  console.log(`✅ Server ready!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
}); 
