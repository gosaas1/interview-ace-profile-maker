import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, X, Check, AlertCircle, Loader2, Linkedin, ExternalLink, Palette, Save, Eye, Brain, ArrowLeft, ArrowRight, Edit, Copy, Download, FileCheck, FileX, RefreshCw } from 'lucide-react';
import { supabase, cvOperations, storageOperations } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import mammoth from 'mammoth';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { CVTemplateSelector } from './CVTemplateSelector';
import { cvTemplates, getTemplateById } from '@/data/cvTemplates';
import { parseCVText, convertToCVBuilderFormat, type ParsedCVData } from '@/lib/cv/parser';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Set up PDF.js worker to use local file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface CVUploadModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// File validation constants for scalability
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

type UploadStep = 'method' | 'upload' | 'parsing' | 'preview' | 'template' | 'builder' | 'success';

const CVUploadModal: React.FC<CVUploadModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<UploadStep>('method');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [linkedinText, setLinkedinText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedCVId, setUploadedCVId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('basic-modern');
  const [parsedCVData, setParsedCVData] = useState<ParsedCVData | null>(null);
  const [cvBuilderData, setCvBuilderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug user authentication
  console.log('CVUploadModal - User:', user);
  console.log('CVUploadModal - User ID:', user?.id);

  // File validation function
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`;
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type not supported. Please upload ${ALLOWED_EXTENSIONS.join(', ')} files`;
    }
    
    return null;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setError(null);
      setUploadedFile(file);
      console.log('File uploaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    }
  };

  const handleMethodSelect = (method: 'file' | 'text') => {
    setUploadMethod(method);
    setCurrentStep('upload');
  };

  const handleProcessContent = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let rawText = '';

      if (uploadMethod === 'file' && uploadedFile) {
        rawText = await extractFileContent(uploadedFile);
      } else if (uploadMethod === 'text' && cvText.trim()) {
        rawText = cvText.trim();
      } else {
        throw new Error('No content to process');
      }

      console.log('Processing raw text:', rawText.substring(0, 200) + '...');

      // Parse the CV text
      const parsed = parseCVText(rawText);
      setParsedCVData(parsed);

      // Convert to CV builder format
      const builderData = convertToCVBuilderFormat(parsed);
      setCvBuilderData(builderData);

      setCurrentStep('preview');
      toast.success('CV content processed successfully!');

    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process content');
      toast.error('Failed to process CV content. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('builder');
  };

  const handleProceedToBuilder = () => {
    if (cvBuilderData) {
      // Navigate to unified CV builder with the parsed data
      navigate('/unified-cv-builder', { 
        state: { 
          initialData: cvBuilderData,
          selectedTemplate: selectedTemplate,
          fromUpload: true
        }
      });
      onClose();
    }
  };

  // Extract text content from file
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
        reader.readAsArrayBuffer(file);
      });
    }
    
    // PDF
    if (file.name.endsWith('.pdf')) {
      return extractTextFromPDF(file);
    }
    
    // TXT
    if (file.name.endsWith('.txt')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
    
    throw new Error('Unsupported file type');
  };

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
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold">Upload Your CV</h3>
        <p className="text-muted-foreground">
          Choose how you'd like to add your CV content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMethodSelect('file')}
        >
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-blue-600 mb-4" />
            <h4 className="font-semibold mb-2">Upload File</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Upload PDF, DOCX, or TXT files
            </p>
            <Badge variant="outline">PDF, DOCX, TXT</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMethodSelect('text')}
        >
          <CardContent className="p-6 text-center">
            <Edit className="mx-auto h-8 w-8 text-green-600 mb-4" />
            <h4 className="font-semibold mb-2">Paste Text</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Copy and paste your CV content
            </p>
            <Badge variant="outline">Quick & Easy</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold">
          {uploadMethod === 'file' ? 'Upload CV File' : 'Paste CV Content'}
        </h3>
        <p className="text-muted-foreground">
          {uploadMethod === 'file' 
            ? 'Upload your CV file and we\'ll extract the content automatically'
            : 'Paste your CV content and we\'ll parse it for you'
          }
        </p>
      </div>

      {uploadMethod === 'file' ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <FileCheck className="h-5 w-5" />
                  <span className="font-medium">{uploadedFile.name}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button variant="outline" onClick={() => setUploadedFile(null)}>
                  <FileX className="h-4 w-4 mr-2" />
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">
                    PDF, DOCX, or TXT files up to 10MB
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cv-text">CV Content</Label>
            <Textarea
              id="cv-text"
              placeholder="Paste your CV content here..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="min-h-[300px]"
            />
          </div>
          
          <div>
            <Label htmlFor="linkedin-text">LinkedIn Profile (Optional)</Label>
            <Textarea
              id="linkedin-text"
              placeholder="Paste your LinkedIn profile content for enhanced parsing..."
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleProcessContent}
          disabled={!uploadedFile && !cvText.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Process CV
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold">CV Content Preview</h3>
        <p className="text-muted-foreground">
          Review the extracted information from your CV
        </p>
      </div>

      {parsedCVData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <Input value={parsedCVData.full_name} readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium">Job Title</Label>
                <Input value={parsedCVData.job_title || ''} readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <Input value={parsedCVData.email} readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <Input value={parsedCVData.phone} readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <Input value={parsedCVData.location} readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Summary & Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Summary</Label>
                <Textarea 
                  value={parsedCVData.summary} 
                  readOnly 
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-1">
                  {parsedCVData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Experience ({parsedCVData.experiences.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedCVData.experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <h4 className="font-medium">{exp.role}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-xs text-gray-500">{exp.duration}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Education ({parsedCVData.education.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedCVData.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-green-200 pl-4">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('upload')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={() => setCurrentStep('template')}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Palette className="h-4 w-4 mr-2" />
          Choose Template
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderTemplateStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="mx-auto h-12 w-12 text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold">Choose Your Template</h3>
        <p className="text-muted-foreground">
          Select a template that best represents your professional style
        </p>
      </div>
      
      <CVTemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
        userTier="elite" // Show all templates for now
        showAllTemplates={true}
      />
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('preview')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Preview
        </Button>
        
        <Button 
          onClick={handleProceedToBuilder}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Eye className="h-4 w-4 mr-2" />
          Build CV
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'method':
        return renderMethodSelection();
      case 'upload':
        return renderUploadStep();
      case 'preview':
        return renderPreviewStep();
      case 'template':
        return renderTemplateStep();
      default:
        return renderMethodSelection();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload & Create CV</DialogTitle>
          <DialogDescription>
            Upload your existing CV and create a new professional version
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            {['method', 'upload', 'preview', 'template'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === step 
                    ? "bg-blue-600 text-white" 
                    : index < ['method', 'upload', 'preview', 'template'].indexOf(currentStep)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={cn(
                    "w-12 h-1",
                    index < ['method', 'upload', 'preview', 'template'].indexOf(currentStep)
                      ? "bg-green-500"
                      : "bg-gray-200"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadModal;
