import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  Edit, 
  Palette, 
  Save, 
  Eye, 
  Copy,
  Download,
  FileCheck,
  FileX,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import mammoth from 'mammoth';
import { CVTemplateSelector } from '../cv/CVTemplateSelector';
import { cvTemplates, getTemplatesByTier, getTemplateById } from '@/data/cvTemplates';
import { CVBuilderRefactored } from './CVBuilderRefactored';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface CVUploadFlowProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface ParsedCVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  rawText: string;
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

const CVUploadFlow: React.FC<CVUploadFlowProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Flow states
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'edit' | 'template' | 'builder'>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('ats-optimized-classic');
  const [isSaving, setIsSaving] = useState(false);
  const [savedCVId, setSavedCVId] = useState<string | null>(null);

  // File validation
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`;
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type not supported. Please upload ${ALLOWED_EXTENSIONS.join(', ')} files`;
    }
    
    return null;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast({
          title: "File Error",
          description: validationError,
          variant: "destructive",
        });
        return;
      }
      
      setError(null);
      setUploadedFile(file);
      processFile(file);
    }
  };

  // Process uploaded file
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const rawText = await extractFileContent(file);
      const parsedData = await parseCVData(rawText);
      setParsedData(parsedData);
      setCurrentStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      toast({
        title: "Processing Error",
        description: err instanceof Error ? err.message : 'Failed to process file',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Extract text from different file types
  const extractFileContent = async (file: File): Promise<string> => {
    // DOCX
    if (file.name.endsWith('.docx')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const { value } = await mammoth.extractRawText({ arrayBuffer });
            resolve(value);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read DOCX file'));
        reader.readAsArrayBuffer(file);
      });
    }
    
    // TXT
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            resolve(content);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    }
    
    // PDF
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        return await extractTextFromPDF(file);
      } catch (err) {
        throw new Error('Failed to extract text from PDF. Please paste your CV content manually.');
      }
    }
    
    throw new Error('Unsupported file type');
  };

  // Extract text from PDF
  async function extractTextFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      throw new Error('Failed to extract text from PDF');
    }
  }

  // Parse CV data from raw text
  const parseCVData = async (rawText: string): Promise<ParsedCVData> => {
    // This is a simplified parser - in a real app, you'd use AI/ML for better extraction
    const lines = rawText.split('\n').filter(line => line.trim());
    
    // Extract basic info
    const fullName = lines[0]?.trim() || 'Your Name';
    const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';
    
    const phoneMatch = rawText.match(/[\+]?[1-9]?[\d]{1,14}/);
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    const locationMatch = rawText.match(/(?:Location|Address|City):\s*([^\n\r]+)/i) || 
                         rawText.match(/([A-Za-z\s]+,\s*[A-Z]{2})/);
    const location = locationMatch ? locationMatch[1] : '';
    
    // Extract skills
    const skillsMatch = rawText.match(/(?:Skills|Technologies|Expertise):\s*([^\n\r]+)/i);
    const skills = skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()) : [];
    
    // Generate summary
    const first500 = rawText.substring(0, 500);
    const lastPeriod = first500.lastIndexOf('.');
    const summary = lastPeriod > 400 ? first500.substring(0, lastPeriod + 1) : first500;
    
    // Extract work experience
    const experience: Array<{title: string; company: string; duration: string; description: string}> = [];
    
    // Look for common experience section headers
    const experienceSectionPatterns = [
      /(?:EMPLOYMENT HISTORY|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EXPERIENCE|CAREER HISTORY)/i,
      /(?:JOB HISTORY|EMPLOYMENT|WORK HISTORY)/i
    ];
    
    let experienceStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (experienceSectionPatterns.some(pattern => pattern.test(line))) {
        experienceStartIndex = i + 1;
        break;
      }
    }
    
    if (experienceStartIndex !== -1) {
      let currentExperience: any = null;
      let descriptionLines: string[] = [];
      
      for (let i = experienceStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;
        
        // Look for date patterns that indicate new job entries
        const datePattern = /(\d{4}\s*[-—–]\s*\d{4}|\d{4}\s*[-—–]\s*Present|\d{4}\s*[-—–]\s*Current|\w+\s+\d{4}\s*[-—–]\s*\w+\s+\d{4})/i;
        const hasDate = datePattern.test(line);
        
        // Look for job title patterns (usually in caps or followed by company)
        const titlePattern = /^([A-Z][A-Z\s&]+)(?:\s*[-—–]\s*|\s+at\s+|\s*,\s*)(.+)$/;
        const titleMatch = line.match(titlePattern);
        
        // If we find a new date or title pattern, save previous experience and start new one
        if ((hasDate || titleMatch) && currentExperience) {
          if (currentExperience.title && currentExperience.company) {
            currentExperience.description = descriptionLines.join(' ').trim();
            experience.push(currentExperience);
          }
          currentExperience = null;
          descriptionLines = [];
        }
        
        // Start new experience entry
        if (hasDate && !currentExperience) {
          const dateMatch = line.match(datePattern);
          const duration = dateMatch ? dateMatch[1] : '';
          
          // Try to extract title and company from the same line or next line
          let title = '';
          let company = '';
          
          // Check if this line has title/company info
          if (titleMatch) {
            title = titleMatch[1].trim();
            company = titleMatch[2].trim();
          } else {
            // Look for title in next few lines
            for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
              const nextLine = lines[j].trim();
              if (nextLine && !nextLine.match(datePattern)) {
                const nextTitleMatch = nextLine.match(/^([A-Z][A-Z\s&]+)(?:\s*[-—–]\s*|\s+at\s+|\s*,\s*)(.+)$/);
                if (nextTitleMatch) {
                  title = nextTitleMatch[1].trim();
                  company = nextTitleMatch[2].trim();
                  i = j; // Skip this line in main loop
                } else if (!title) {
                  title = nextLine;
                  i = j;
                }
                break;
              }
            }
          }
          
          currentExperience = {
            title: title || 'Professional Role',
            company: company || 'Company',
            duration: duration,
            description: ''
          };
        } else if (currentExperience && line) {
          // Add line to description if it's not a new job entry
          if (!line.match(datePattern) && !line.match(/^(EDUCATION|SKILLS|CERTIFICATIONS|LANGUAGES)/i)) {
            descriptionLines.push(line);
          }
        }
      }
      
      // Add the last experience entry
      if (currentExperience && currentExperience.title && currentExperience.company) {
        currentExperience.description = descriptionLines.join(' ').trim();
        experience.push(currentExperience);
      }
    }
    
    // If no experience found with structured parsing, try to extract from raw text
    if (experience.length === 0) {
      // Look for any text that might be experience
      const experienceKeywords = ['years', 'experience', 'worked', 'managed', 'developed', 'implemented', 'led', 'coordinated'];
      const sentences = rawText.split(/[.!?]+/).filter(s => s.trim().length > 20);
      
      for (const sentence of sentences) {
        if (experienceKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
          experience.push({
            title: 'Professional Experience',
            company: 'Various Companies',
            duration: 'Multiple Years',
            description: sentence.trim()
          });
          break;
        }
      }
    }
    
    // Extract education
    const education: Array<{degree: string; institution: string; year: string}> = [];
    
    return {
      fullName,
      email,
      phone,
      location,
      summary,
      skills,
      experience,
      education,
      rawText
    };
  };

  // Handle manual data editing
  const handleEditData = () => {
    setCurrentStep('edit');
  };

  // Handle template selection
  const handleChooseTemplate = () => {
    setCurrentStep('template');
  };

  // Handle proceed to builder
  const handleProceedToBuilder = () => {
    setCurrentStep('builder');
  };

  // Save CV to database
  const saveCVToDatabase = async () => {
    if (!parsedData || !user) return;
    
    // If already saved, show success message
    if (savedCVId) {
      toast({
        title: "CV Already Saved",
        description: "Your CV has already been saved successfully.",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('cvs')
        .insert({
          user_id: user.id,
          full_name: parsedData.fullName,
          email: parsedData.email,
          phone: parsedData.phone,
          location: parsedData.location,
          summary: parsedData.summary,
          skills: parsedData.skills.join(', '),
          experiences: parsedData.experience,
          education: parsedData.education,
          template_id: selectedTemplate,
          content: parsedData.rawText,
          file_name: uploadedFile?.name || 'Uploaded CV',
          file_size: uploadedFile?.size || 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      setSavedCVId(data.id);
      toast({
        title: "CV Saved Successfully",
        description: `Your CV has been saved with ${parsedData.experience.length} work experiences extracted.`,
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error saving CV:', error);
      toast({
        title: "Save Error",
        description: "Failed to save CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  // Render upload step
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Upload Your CV</h3>
        <p className="text-muted-foreground">
          Upload your existing CV (PDF, DOCX, or TXT) and we'll extract the information for you.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Supported formats: PDF, DOCX, TXT (max 10MB)
              </p>
            </div>
            
            {uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                  <Badge variant="secondary">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render preview step
  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileCheck className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold">CV Data Extracted Successfully!</h3>
        <p className="text-muted-foreground">
          We've extracted the following information from your CV. Would you like to edit this data or choose a new template?
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
          <CardDescription>
            Review and edit the information we extracted from your CV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value={parsedData?.fullName || ''} readOnly />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(parsedData?.fullName || '')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value={parsedData?.email || ''} readOnly />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(parsedData?.email || '')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value={parsedData?.phone || ''} readOnly />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(parsedData?.phone || '')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value={parsedData?.location || ''} readOnly />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(parsedData?.location || '')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold">Summary</h4>
            <div className="flex items-start space-x-2">
              <Textarea 
                value={parsedData?.summary || ''} 
                readOnly 
                className="min-h-[100px]"
              />
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(parsedData?.summary || '')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Work Experience */}
          <div className="space-y-4">
            <h4 className="font-semibold">Work Experience ({parsedData?.experience.length || 0} positions)</h4>
            {parsedData?.experience && parsedData.experience.length > 0 ? (
              <div className="space-y-4">
                {parsedData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-sm">{exp.title}</h5>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {exp.duration}
                      </Badge>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {exp.description.length > 200 
                          ? `${exp.description.substring(0, 200)}...` 
                          : exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground text-sm">
                  No work experience detected. This might be due to:
                </p>
                <ul className="text-muted-foreground text-sm mt-2 list-disc list-inside">
                  <li>CV format not recognized</li>
                  <li>Experience section not clearly marked</li>
                  <li>Date formats not standard</li>
                </ul>
                <p className="text-muted-foreground text-sm mt-2">
                  You can add experience manually in the editor.
                </p>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Skills */}
          <div className="space-y-4">
            <h4 className="font-semibold">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {parsedData?.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
            {parsedData?.skills.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No skills detected. You can add them manually in the editor.
              </p>
            )}
          </div>
          
          <Separator />
          
          {/* Raw Text Preview */}
          <div className="space-y-4">
            <h4 className="font-semibold">Raw Text Preview</h4>
            <div className="max-h-40 overflow-y-auto p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {parsedData?.rawText.substring(0, 500)}...
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => copyToClipboard(parsedData?.rawText || '')}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Full Text
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setCurrentStep('upload')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Upload Different File
        </Button>
        <Button 
          onClick={saveCVToDatabase}
          disabled={isSaving || !!savedCVId}
          className={savedCVId ? "bg-green-600 text-white" : "bg-green-600 hover:bg-green-700"}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : savedCVId ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              CV Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save CV
            </>
          )}
        </Button>
        <Button onClick={handleEditData}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Data
        </Button>
        <Button onClick={handleChooseTemplate}>
          <Palette className="mr-2 h-4 w-4" />
          Choose Template
        </Button>
      </div>
    </div>
  );

  // Render edit step
  const renderEditStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Edit className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold">Edit Your CV Data</h3>
        <p className="text-muted-foreground">
          Make any necessary changes to the extracted information before proceeding.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Information</CardTitle>
          <CardDescription>
            Update any fields that need correction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input 
                value={parsedData?.fullName || ''} 
                onChange={(e) => setParsedData(prev => prev ? {...prev, fullName: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={parsedData?.email || ''} 
                onChange={(e) => setParsedData(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input 
                value={parsedData?.phone || ''} 
                onChange={(e) => setParsedData(prev => prev ? {...prev, phone: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input 
                value={parsedData?.location || ''} 
                onChange={(e) => setParsedData(prev => prev ? {...prev, location: e.target.value} : null)}
              />
            </div>
          </div>
          
          <div>
            <Label>Summary</Label>
            <Textarea 
              value={parsedData?.summary || ''} 
              onChange={(e) => setParsedData(prev => prev ? {...prev, summary: e.target.value} : null)}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label>Skills (comma-separated)</Label>
            <Input 
              value={parsedData?.skills.join(', ') || ''} 
              onChange={(e) => setParsedData(prev => prev ? {...prev, skills: e.target.value.split(',').map(s => s.trim())} : null)}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setCurrentStep('preview')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Preview
        </Button>
        <Button 
          onClick={saveCVToDatabase}
          disabled={isSaving || !!savedCVId}
          className={savedCVId ? "bg-green-600 text-white" : "bg-green-600 hover:bg-green-700"}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : savedCVId ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              CV Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save CV
            </>
          )}
        </Button>
        <Button onClick={handleChooseTemplate}>
          <Palette className="mr-2 h-4 w-4" />
          Choose Template
        </Button>
      </div>
    </div>
  );

  // Render template selection step
  const renderTemplateStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="mx-auto h-12 w-12 text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold">Choose Your Template</h3>
        <p className="text-muted-foreground">
          Select a template that best represents your professional style and industry.
        </p>
      </div>
      
      <CVTemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateSelect={(templateId) => setSelectedTemplate(templateId)}
      />
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setCurrentStep('edit')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Edit
        </Button>
        <Button onClick={handleProceedToBuilder}>
          <Eye className="mr-2 h-4 w-4" />
          Preview & Build
        </Button>
      </div>
    </div>
  );

  // Render builder step
  const renderBuilderStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold">Build Your CV</h3>
        <p className="text-muted-foreground">
          Customize your CV with the selected template and your extracted data.
        </p>
      </div>
      
      {parsedData && (
        <CVBuilderRefactored
          onClose={() => setCurrentStep('template')}
          onSuccess={() => {
            saveCVToDatabase();
            if (onSuccess) onSuccess();
          }}
          editingCV={{
            id: '0',
            user_id: user?.id || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: parsedData.fullName,
            job_title: '',
            email: parsedData.email,
            phone: parsedData.phone,
            location: parsedData.location,
            linkedin_url: '',
            portfolio_url: '',
            summary: parsedData.summary,
            experiences: parsedData.experience.map(exp => ({
              company: exp.company,
              role: exp.title,
              duration: exp.duration,
              description: exp.description
            })),
            education: parsedData.education.map(edu => ({
              institution: edu.institution,
              degree: edu.degree,
              year: edu.year,
              gpa: ''
            })),
            projects: [],
            skills: parsedData.skills.join(', '),
            languages: [],
            certifications: '',
            references: [],
            template_id: selectedTemplate
          }}
        />
      )}
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CV Upload & Builder</DialogTitle>
          <DialogDescription>
            Upload your existing CV and we'll help you create a professional version with our templates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {currentStep === 'upload' && renderUploadStep()}
          {currentStep === 'preview' && renderPreviewStep()}
          {currentStep === 'edit' && renderEditStep()}
          {currentStep === 'template' && renderTemplateStep()}
          {currentStep === 'builder' && renderBuilderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadFlow; 