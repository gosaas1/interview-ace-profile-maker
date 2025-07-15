import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://iqikeltdqmpdsczakril.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODExODksImV4cCI6MjA2NTE1NzE4OX0.o_c4yk6tKYM17uTXtdepkRWR4PUp71lflaciAcLB6i4'
);

// Test endpoint to verify database connection and new schema
router.get('/test', async (req: Request, res: Response) => {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('cvs')
      .select('id, title, full_name, email, template_id, skills, created_at')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed', 
        error: error.message 
      });
    }
    
    console.log('Database connection successful');
    console.log('Test data retrieved:', data);
    
    res.json({ 
      status: 'success', 
      message: 'Database connection working',
      database: 'connected',
      table: 'cvs',
      testData: data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Test failed', 
      error: error.message 
    });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('cv');

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const pdfBuffer = await fs.promises.readFile(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text || '';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file');
  }
}

// Helper function to extract text from Word document
async function extractTextFromWord(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Helper function to process extracted text
function processExtractedText(text: string) {
  // Common section headers in CVs
  const sectionHeaders = [
    'experience',
    'work experience',
    'employment',
    'education',
    'academic',
    'skills',
    'technical skills',
    'certifications',
    'professional summary',
    'summary',
    'profile',
  ];

  // Split text into lines and process
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  const sections: Record<string, string[]> = {
    personalInfo: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  };

  let currentSection = 'personalInfo';
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if line is a section header
    const isHeader = sectionHeaders.some(header => 
      lowerLine.includes(header) && line.length < 50
    );

    if (isHeader) {
      // Map the header to our section names
      if (lowerLine.includes('experience') || lowerLine.includes('employment')) {
        currentSection = 'experience';
      } else if (lowerLine.includes('education') || lowerLine.includes('academic')) {
        currentSection = 'education';
      } else if (lowerLine.includes('skill')) {
        currentSection = 'skills';
      } else if (lowerLine.includes('certification')) {
        currentSection = 'certifications';
      } else if (lowerLine.includes('summary') || lowerLine.includes('profile')) {
        currentSection = 'summary';
      }
    } else {
      // Add line to current section
      sections[currentSection].push(line);
    }
  }

  // Clean up sections
  for (const key in sections) {
    sections[key] = sections[key]
      .filter(Boolean)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  return sections;
}

// --- CV Content Type for Validation ---
interface CVContent {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  summary: string;
  experience: any[];
  education: any[];
  skills: string[];
  certifications: any[];
  projects?: any[];
  languages?: any[];
  references?: any[];
  isSampleDatabase?: boolean;
}

function validateCVContent(content: any): content is CVContent {
  return (
    typeof content.full_name === 'string' &&
    typeof content.email === 'string' &&
    typeof content.phone === 'string' &&
    typeof content.location === 'string' &&
    typeof content.linkedin_url === 'string' &&
    typeof content.portfolio_url === 'string' &&
    typeof content.summary === 'string' &&
    Array.isArray(content.experience) &&
    Array.isArray(content.education) &&
    Array.isArray(content.skills) &&
    Array.isArray(content.certifications)
  );
}

// Create CV from builder (new endpoint)
router.post('/create', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, content, is_public = false } = req.body;

    // Validate required fields
    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    // Validate content structure
    if (typeof content !== 'object' || !content.full_name) {
      res.status(400).json({ error: 'Invalid content format. Content must be an object with full_name.' });
      return;
    }

    if (!validateCVContent(content)) {
      res.status(400).json({ error: 'Invalid content format. Missing or invalid fields.' });
      return;
    }

    // Create CV record in database
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .insert([
        {
          user_id: req.user.id,
          title: title.trim(),
          content: content,
          is_public: is_public,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (cvError) {
      console.error('Error creating CV record:', cvError);
      res.status(500).json({ error: 'Failed to create CV record', details: cvError.message });
      return;
    }

    res.status(201).json(cvData);
  } catch (error: any) {
    console.error('Error creating CV:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload CV endpoint (existing - for file uploads)
router.post('/upload', authenticateUser, (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Extract text based on file type
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      let extractedText = '';

      try {
        if (fileExt === '.pdf') {
          extractedText = await extractTextFromPDF(req.file.path);
        } else if (fileExt === '.docx' || fileExt === '.doc') {
          extractedText = await extractTextFromWord(req.file.path);
        } else {
          return res.status(400).json({ error: 'Invalid file type. Only PDF and Word documents are allowed.' });
        }
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

      // Process the extracted text
      const sections = processExtractedText(extractedText);

      // Upload file to Supabase Storage
      const fileContent = await fs.promises.readFile(req.file.path);
      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(`${req.user.id}/${req.file.filename}`, fileContent);

      if (uploadError) {
        console.error('Error uploading to storage:', uploadError);
        return res.status(500).json({ error: 'Failed to upload file to storage' });
      }

      // Create CV record in database (use cvs table for consistency)
      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .insert([
          {
            user_id: req.user.id,
            title: req.file.originalname,
            content: sections,
            is_public: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (cvError) {
        console.error('Error creating CV record:', cvError);
        return res.status(500).json({ error: 'Failed to create CV record' });
      }

      // Clean up temporary file
      await fs.promises.unlink(req.file.path);

      return res.status(201).json(cvData);
    } catch (error: any) {
      console.error('Error uploading CV:', error);
      return res.status(500).json({ error: error.message });
    }
  });
});

// Get user's CVs
router.get('/', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching CVs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific CV
router.get('/:id', authenticateUser, async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { data: cv, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      // Handle both "not found" and invalid UUID errors
      if (error.code === 'PGRST116' || error.code === '22P02') {
        res.status(404).json({ error: 'CV not found' });
        return;
      }
      throw error;
    }

    if (!cv) {
      res.status(404).json({ error: 'CV not found' });
      return;
    }

    res.json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ error: 'Failed to fetch CV' });
  }
});

// Update CV
router.put('/:id', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, content, is_public } = req.body;
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only update provided fields
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (is_public !== undefined) updateData.is_public = is_public;

    const { data, error } = await supabase
      .from('cvs')
      .update(updateData)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      res.status(404).json({ error: 'CV not found' });
      return;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error updating CV:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete CV
router.delete('/:id', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get CV data to delete associated file
    const { data: cvData, error: fetchError } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) throw fetchError;

    if (!cvData) {
      res.status(404).json({ error: 'CV not found' });
      return;
    }

    // Delete file from storage if it exists (for uploaded CVs)
    if (cvData.content && cvData.content.file_path) {
      const { error: storageError } = await supabase.storage
        .from('cv-uploads')
        .remove([cvData.content.file_path]);

      if (storageError) {
        console.warn('Could not delete file from storage:', storageError);
        // Don't fail the whole operation if storage deletion fails
      }
    }

    // Delete CV record
    const { error: deleteError } = await supabase
      .from('cvs')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (deleteError) throw deleteError;

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 