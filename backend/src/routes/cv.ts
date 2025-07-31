import express, { Request, Response } from 'express';
import multer from 'multer';
import { authenticateUser } from '../middleware/auth.js';
import { normalizeCVContent, validateCVContent } from '../lib/cv.js';
import { supabase } from '../lib/supabase.js';
import mammoth from 'mammoth';
// AWS Textract functionality removed - using Cohere parser only
import { 
  extractTextFromPDF as extractTextFromCohere,
  calculateFileHash
} from '../lib/cohere-parser.js';

const router = express.Router();

// ─── ENFORCE AUTH ON ALL /api/cv ROUTES ─────────────────────────────────────
router.use(authenticateUser);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Allow only PDF, DOCX, and TXT files
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

// Helper function to extract text from different file types
async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  try {
    const buffer = file.buffer;
    
    // Handle PDF files with Textract + Cohere fallback
    if (file.mimetype === 'application/pdf') {
      try {
        console.log('🔍 Processing PDF with Textract + Cohere fallback...');
        
        // Use Cohere parser for PDF files
        try {
          console.log('🚀 Using Cohere parser for PDF...');
          const cohereResult = await extractTextFromCohere(buffer);
          
          console.log('✅ Cohere parsing completed successfully');
          console.log('📊 Confidence:', cohereResult.confidence.toFixed(2) + '%');
          console.log('💸 Actual cost: $', cohereResult.cost.toFixed(4));
          
          return cohereResult.text;
        } catch (cohereError: any) {
          console.error('❌ Cohere parsing failed:', cohereError.message);
          throw new Error(`PDF parsing failed: ${cohereError.message}`);
        }
      } catch (err: any) {
        console.error('❌ PDF parsing completely failed:', err);
        // Return empty string instead of crashing
        console.warn('⚠️ PDF parsing failed, continuing with empty text');
        return '';
      }
    }
    
    // Handle DOCX files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value.trim();
      } catch (error) {
        console.error('DOCX extraction error:', error);
        throw new Error('Failed to extract text from DOCX file');
      }
    }
    
    // Handle TXT files
    if (file.mimetype === 'text/plain') {
      return buffer.toString('utf-8').trim();
    }
    
    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('Text extraction error:', error);
    throw error;
  }
}

// POST /api/cv/parse - Parse CV file and return extracted text with method
router.post('/parse', upload.single('cvFile'), async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 CV PARSE: User authenticated:', req.user);

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ 
        error: 'NO_FILE', 
        details: 'No file uploaded. Please select a PDF, DOCX, or TXT file.' 
      });
      return;
    }

    const file = req.file;
    console.log('📁 File received for parsing:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Extract text content from file with method tracking
    let extractedText: string;
    let parsingMethod: 'textract' | 'cohere' | 'mammoth' | 'text' = 'text';
    let warning: string | undefined;

    try {
      if (file.mimetype === 'application/pdf') {
        // Try Textract first, then Cohere fallback
        try {
          console.log('🚀 Attempting Cohere parsing...');
          const cohereResult = await extractTextFromCohere(file.buffer);
          extractedText = cohereResult.text;
          parsingMethod = 'cohere';
          console.log('✅ Cohere parsing successful');
        } catch (cohereError: any) {
          console.error('❌ Cohere parsing failed:', cohereError.message);
          throw new Error(`PDF parsing failed: ${cohereError.message}`);
        }
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        extractedText = result.value.trim();
        parsingMethod = 'mammoth';
      } else if (file.mimetype === 'text/plain') {
        extractedText = file.buffer.toString('utf-8').trim();
        parsingMethod = 'text';
      } else {
        throw new Error('Unsupported file type');
      }

      console.log('📝 Text extracted, length:', extractedText.length);
      
      // If no text was extracted, provide a fallback message
      if (!extractedText || extractedText.trim().length === 0) {
        console.warn('⚠️ No text extracted from file, using fallback content');
        extractedText = 'Text extraction failed - file content could not be parsed';
        warning = 'No text could be extracted from the file';
      }

      // Calculate file hash for deduplication
      const fileHash = calculateFileHash(file.buffer);

      // Return parsing result
      res.status(200).json({
        success: true,
        parsedText: extractedText,
        method: parsingMethod,
        fileHash: fileHash,
        warning: warning,
        filename: file.originalname,
        contentLength: extractedText.length
      });

    } catch (error: any) {
      console.error('❌ Text extraction failed:', error);
      res.status(400).json({ 
        error: 'TEXT_EXTRACTION_FAILED', 
        details: error.message 
      });
      return;
    }

  } catch (error: any) {
    console.error('❌ CV PARSE ERROR:', error);
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ 
        error: 'FILE_TOO_LARGE', 
        details: 'File size exceeds 10MB limit' 
      });
      return;
    }
    
    if (error.message && error.message.includes('Invalid file type')) {
      res.status(400).json({ 
        error: 'INVALID_FILE_TYPE', 
        details: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      error: 'INTERNAL_ERROR', 
      details: 'Failed to parse CV' 
    });
  }
});

// POST /api/cv/upload
router.post('/upload', upload.single('cvFile'), async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('✅ CV UPLOAD: User authenticated:', req.user);

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ 
        error: 'NO_FILE', 
        details: 'No file uploaded. Please select a PDF, DOCX, or TXT file.' 
      });
      return;
    }

    const file = req.file;
    console.log('📁 File received:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // 1. Extract text content from file
    let extractedText: string;
    try {
      extractedText = await extractTextFromFile(file);
      console.log('📝 Text extracted, length:', extractedText.length);
      
      // If no text was extracted, provide a fallback message
      if (!extractedText || extractedText.trim().length === 0) {
        console.warn('⚠️ No text extracted from file, using fallback content');
        extractedText = 'Text extraction failed - file content could not be parsed';
      }
    } catch (error: any) {
      console.error('❌ Text extraction failed:', error);
      res.status(400).json({ 
        error: 'TEXT_EXTRACTION_FAILED', 
        details: error.message 
      });
      return;
    }

    // 2. Upload file to Supabase storage
    let fileUrl: string | null = null;
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('cv-files')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cv-files')
        .getPublicUrl(fileName);
      
      fileUrl = urlData.publicUrl;
      console.log('✅ File uploaded to storage:', fileUrl);
    } catch (error: any) {
      console.error('❌ Storage upload failed:', error);
      // Continue without file URL - we still have the extracted text
      console.warn('⚠️ Continuing without file storage, using extracted text only');
    }

    // 3. Prepare CV data for database
    const cvData = {
      title: file.originalname.replace(/\.[^/.]+$/, ''), // Remove file extension
      content: JSON.stringify({
        full_name: 'Extracted from file',
        email: '',
        phone: '',
        location: '',
        summary: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
        experience: [],
        education: [],
        skills: [],
        certifications: '',
        raw_text: extractedText
      }),
      template_id: 'uploaded',
      is_public: false,
      user_id: req.user?.id,
      content_type: 'file',
      file_name: file.originalname,
      file_size: file.size,
      file_url: fileUrl,
      ats_score: 0,
      is_active: true,
      version: 1,
      is_primary: false
    };

    console.log('📝 Attempting to save CV with data:', {
      title: cvData.title,
      content_length: cvData.content.length,
      file_name: cvData.file_name,
      file_size: cvData.file_size
    });

    // 4. Insert into database
    const { data: cv, error } = await supabase
      .from('cvs')
      .insert(cvData)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      res.status(500).json({ 
        error: 'DATABASE_ERROR', 
        details: error.message 
      });
      return;
    }

    console.log('✅ CV uploaded successfully:', cv.id);

    // 5. Return success response
    res.status(200).json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        id: cv.id,
        filename: file.originalname,
        content_length: extractedText.length,
        file_url: fileUrl,
        created_at: cv.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ CV UPLOAD ERROR:', error);
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ 
        error: 'FILE_TOO_LARGE', 
        details: 'File size exceeds 10MB limit' 
      });
      return;
    }
    
    if (error.message && error.message.includes('Invalid file type')) {
      res.status(400).json({ 
        error: 'INVALID_FILE_TYPE', 
        details: error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      error: 'INTERNAL_ERROR', 
      details: 'Failed to upload CV' 
    });
  }
});

// GET /api/cv/:id - Fetch a specific CV by ID for the logged-in user
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    console.log('🔍 Fetching CV:', { id, userId });

    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      res.status(500).json({ 
        error: 'Database error',
        details: error.message 
      });
      return;
    }

    if (!data) {
      res.status(404).json({ 
        error: 'CV not found',
        code: 'CV_NOT_FOUND',
        details: 'CV not found or not owned by user'
      });
      return;
    }

    // Parse individual fields from database
    let parsedData: any = {};
    
    console.log('🔍 Raw database data:', {
      full_name: data.full_name,
      email: data.email,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      certifications: data.certifications
    });
    
    try {
      // Use individual database columns as the primary source
      parsedData = {
        // Personal info structure that templates expect
        personalInfo: {
          fullName: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin: data.linkedin_url || '',
          website: data.portfolio_url || '',
          summary: data.summary || ''
        },
        // Array fields
        experiences: data.experience ? JSON.parse(data.experience) : [],
        education: data.education ? JSON.parse(data.education) : [],
        skills: data.skills ? JSON.parse(data.skills) : [],
        certifications: data.certifications ? JSON.parse(data.certifications) : [],
        projects: data.projects ? JSON.parse(data.projects) : [],
        languages: data.languages ? JSON.parse(data.languages) : [],
        references: data.references ? JSON.parse(data.references) : []
      };
      
      console.log('✅ Parsed data structure:', {
        personalInfo: parsedData.personalInfo,
        experiencesCount: parsedData.experiences.length,
        educationCount: parsedData.education.length,
        skillsCount: parsedData.skills.length,
        certificationsCount: parsedData.certifications.length
      });
      
      // Fallback to content field if individual fields are empty
      if (!data.full_name && data.content) {
        try {
          const content = JSON.parse(data.content);
          // Merge content data, prioritizing already parsed individual fields
          parsedData = { 
            ...content, 
            personalInfo: { ...content.personalInfo, ...parsedData.personalInfo },
            experiences: [...(content.experiences || []), ...(parsedData.experiences || [])],
            education: [...(content.education || []), ...(parsedData.education || [])],
            skills: [...(content.skills || []), ...(parsedData.skills || [])],
            certifications: [...(content.certifications || []), ...(parsedData.certifications || [])],
            projects: [...(content.projects || []), ...(parsedData.projects || [])],
            languages: [...(content.languages || []), ...(parsedData.languages || [])],
            references: [...(content.references || []), ...(parsedData.references || [])],
          };
        } catch (parseError) {
          console.warn('⚠️ Could not parse fallback content:', parseError);
        }
      }
    } catch (parseError) {
      console.warn('⚠️ Could not parse CV data:', parseError);
    }

    const response = {
      id: data.id,
      user_id: data.user_id,
      created_at: data.created_at,
      title: data.title,
      template_id: data.template_id,
      content: parsedData
    };

    console.log('✅ CV fetched successfully:', data.id);
    res.status(200).json(response);

  } catch (error: any) {
    console.error('❌ CV fetch error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// PUT /api/cv/:id - Update existing CV
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('✅ CV UPDATE: User authenticated:', req.user);
    
    const { id } = req.params;
    const { title, content, template_id, is_public } = req.body;

    if (!id) {
      res.status(400).json({ 
        error: 'MISSING_ID', 
        details: 'CV ID is required' 
      });
      return;
    }

    if (!content) {
      res.status(400).json({ 
        error: 'MISSING_CONTENT', 
        details: 'CV content is required' 
      });
      return;
    }

    // 1. Check if CV exists and belongs to user
    const { data: existingCV, error: fetchError } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user?.id)
      .single();

    if (fetchError || !existingCV) {
      console.error('❌ CV not found or access denied:', fetchError);
      res.status(404).json({ 
        error: 'CV_NOT_FOUND', 
        details: 'CV not found or access denied' 
      });
      return;
    }

    // 2. Normalize and validate content
    console.log('🔍 DEBUG: Raw content received for update:', content);
    const normalizedContent = normalizeCVContent(content);
    console.log('🔍 DEBUG: Normalized content for update:', normalizedContent);
    const isValid = validateCVContent(normalizedContent);
    
    if (!isValid) {
      res.status(400).json({ 
        error: 'INVALID_CONTENT', 
        details: 'CV content validation failed' 
      });
      return;
    }

    // 3. Prepare CV data for database update
    const cvData = {
      title: title?.trim() || existingCV.title,
      cv_filename: title?.trim() || existingCV.cv_filename,
      content: JSON.stringify(normalizedContent),
      // Extract individual fields from normalized content for database columns
      full_name: normalizedContent.full_name || null,
      email: normalizedContent.email || null,
      phone: normalizedContent.phone || null,
      location: normalizedContent.location || null,
      summary: normalizedContent.summary || null,
      linkedin_url: normalizedContent.linkedin_url || null,
      portfolio_url: normalizedContent.portfolio_url || null,
      experience: normalizedContent.experience ? JSON.stringify(normalizedContent.experience) : null,
      education: normalizedContent.education ? JSON.stringify(normalizedContent.education) : null,
      skills: normalizedContent.skills ? JSON.stringify(normalizedContent.skills) : null,
      certifications: normalizedContent.certifications ? JSON.stringify(normalizedContent.certifications) : null,
      projects: normalizedContent.projects ? JSON.stringify(normalizedContent.projects) : null,
      languages: normalizedContent.languages ? JSON.stringify(normalizedContent.languages) : null,
      references: normalizedContent.references ? JSON.stringify(normalizedContent.references) : null,
      template_id: template_id || existingCV.template_id,
      is_public: is_public !== undefined ? is_public : existingCV.is_public,
      updated_at: new Date().toISOString()
    };

    console.log('📝 Attempting to update CV with data:', cvData);

    // 4. Update in database
    const { data: cv, error } = await supabase
      .from('cvs')
      .update(cvData)
      .eq('id', id)
      .eq('user_id', req.user?.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Database update error:', error);
      res.status(500).json({ 
        error: 'DATABASE_ERROR', 
        details: error.message 
      });
      return;
    }

    console.log('✅ CV updated successfully:', cv);

    // 5. Return success response
    res.status(200).json({
      success: true,
      cv: {
        id: cv.id,
        title: cv.title,
        template_id: cv.template_id,
        is_public: cv.is_public,
        created_at: cv.created_at,
        updated_at: cv.updated_at
      }
    });

  } catch (error) {
    console.error('❌ CV UPDATE ERROR:', error);
    res.status(500).json({ 
      error: 'INTERNAL_ERROR', 
      details: 'Failed to update CV' 
    });
  }
});

// GET /api/cv/history - Fetch all uploaded CVs for the current user
router.get('/history', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    console.log('🔍 Fetching CV history for user:', userId);

    const { data, error } = await supabase
      .from('cvs')
      .select('id, title, job_title, file_name, file_size, created_at, updated_at, ats_score, is_active, version, is_primary')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      res.status(500).json({ 
        error: 'Database error',
        details: error.message 
      });
      return;
    }

    // Transform data to include metadata
    const cvHistory = data.map(cv => ({
      id: cv.id,
      title: cv.title,
      job_title: cv.job_title,
      file_name: cv.file_name,
      file_size: cv.file_size,
      created_at: cv.created_at,
      updated_at: cv.updated_at,
      ats_score: cv.ats_score,
      is_active: cv.is_active,
      version: cv.version,
      is_primary: cv.is_primary
    }));

    console.log('✅ CV history fetched successfully:', cvHistory.length, 'CVs');
    res.status(200).json(cvHistory);

  } catch (error: any) {
    console.error('❌ CV history fetch error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// POST /api/cv/create
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('✅ CV CREATE: User authenticated:', req.user);

    const { title, content, is_public = false, template_id = 'basic-modern' } = req.body;

    // 1. Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ error: 'INVALID_TITLE', details: 'Title required' });
      return;
    }

    if (!content || typeof content !== 'object') {
      res.status(400).json({ error: 'INVALID_CONTENT', details: 'Content must be an object' });
      return;
    }

    // 2. Normalize and validate content
    console.log('🔍 DEBUG: Raw content received:', content);
    const normalizedContent = normalizeCVContent(content);
    console.log('🔍 DEBUG: Normalized content:', normalizedContent);
    const isValid = validateCVContent(normalizedContent);
    
    if (!isValid) {
      res.status(400).json({ 
        error: 'INVALID_CONTENT', 
        details: 'CV content validation failed' 
      });
      return;
    }

    // 3. Prepare CV data for database
    const cvData = {
      title: title.trim(), // This is the CV filename (kept for backward compatibility)
      cv_filename: title.trim(), // Separate field for CV filename
      content: JSON.stringify(normalizedContent),
      // Extract individual fields from normalized content for database columns
      // normalizedContent is now a flat structure from normalizeCVContent()
      full_name: normalizedContent.full_name || null,
      email: normalizedContent.email || null,
      phone: normalizedContent.phone || null,
      location: normalizedContent.location || null,
      summary: normalizedContent.summary || null,
      linkedin_url: normalizedContent.linkedin_url || null,
      portfolio_url: normalizedContent.portfolio_url || null,
      experience: normalizedContent.experience ? JSON.stringify(normalizedContent.experience) : null,
      education: normalizedContent.education ? JSON.stringify(normalizedContent.education) : null,
      skills: normalizedContent.skills ? JSON.stringify(normalizedContent.skills) : null,
      certifications: normalizedContent.certifications ? JSON.stringify(normalizedContent.certifications) : null,
      projects: normalizedContent.projects ? JSON.stringify(normalizedContent.projects) : null,
      languages: normalizedContent.languages ? JSON.stringify(normalizedContent.languages) : null,
      references: normalizedContent.references ? JSON.stringify(normalizedContent.references) : null,
      template_id,
      is_public,
      user_id: req.user?.id,
      content_type: 'manual',
      ats_score: 0,
      is_active: true,
      version: 1,
      is_primary: false
    };

    console.log('📝 Attempting to create CV with data:', cvData);

    // 4. Insert into database
    const { data: cv, error } = await supabase
      .from('cvs')
      .insert(cvData)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      res.status(500).json({ 
        error: 'DATABASE_ERROR', 
        details: error.message 
      });
      return;
    }

    console.log('✅ CV created successfully:', cv);

    // 5. Return success response
    res.status(201).json({
      success: true,
      cv: {
        id: cv.id,
        title: cv.title,
        template_id: cv.template_id,
        is_public: cv.is_public,
        created_at: cv.created_at,
        updated_at: cv.updated_at
      }
    });

  } catch (error) {
    console.error('❌ CV CREATE ERROR:', error);
    res.status(500).json({ 
      error: 'INTERNAL_ERROR', 
      details: 'Failed to create CV' 
    });
  }
});

// GET /api/cv/debug-auth
router.get('/debug-auth', (req: Request, res: Response): void => {
  console.log('🔍 DEBUG AUTH: User data:', req.user);
  res.status(200).json({
    authenticated: true,
    user: req.user,
    message: 'Authentication working correctly'
  });
});

export default router; 