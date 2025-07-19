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
  ArrowLeft,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Users,
  Star
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import mammoth from 'mammoth';
import { CVTemplateSelector } from './CVTemplateSelector';
import { cvTemplates, getTemplatesByTier, getTemplateById } from '@/data/cvTemplates';
import CVBuilderNew from './CVBuilderNew';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { normalizeCVData } from '@/lib/cv/normalize';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface CVUploadFlowNewProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface ParsedCVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url?: string;
  website?: string;
  summary: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    start_date: string;
    end_date: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>;
  rawText: string;
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

const CVUploadFlowNew: React.FC<CVUploadFlowNewProps> = ({ onClose, onSuccess }) => {
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
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadedFile(file);
    setError(null);
    setIsProcessing(true);

    try {
      let rawText = '';

      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          rawText += pageText + '\n';
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        rawText = result.value;
      } else {
        rawText = await file.text();
      }

      const parsed = parseCVData(rawText);
      setParsedData(parsed);
      setCurrentStep('preview');
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Parse CV data from raw text
  const parseCVData = (rawText: string): ParsedCVData => {
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
    
    // Extract LinkedIn URL
    const linkedinMatch = rawText.match(/linkedin\.com\/in\/[\w-]+/i);
    const linkedin_url = linkedinMatch ? `https://www.${linkedinMatch[0]}` : '';
    
    // Extract website
    const websiteMatch = rawText.match(/https?:\/\/[^\s]+/);
    const website = websiteMatch ? websiteMatch[0] : '';
    
    // Extract skills
    const skillsMatch = rawText.match(/(?:Skills|Technologies|Expertise):\s*([^\n\r]+)/i);
    const skills = skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()) : [];
    
    // Generate summary
    const first500 = rawText.substring(0, 500);
    const lastPeriod = first500.lastIndexOf('.');
    const summary = lastPeriod > 400 ? first500.substring(0, lastPeriod + 1) : first500;
    
    // Simple experience extraction (this would be much more sophisticated with AI)
    const experience: Array<{title: string; company: string; location: string; start_date: string; end_date: string; current: boolean; description: string}> = [];
    const education: Array<{degree: string; institution: string; location: string; start_date: string; end_date: string; current: boolean; gpa?: string; description?: string}> = [];
    
    return {
      fullName,
      email,
      phone,
      location,
      linkedin_url,
      website,
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
    if (!user || !parsedData) return;

    setIsSaving(true);
    try {
      const cvData = {
        user_id: user.id,
        title: `${parsedData.fullName}'s CV`,
        full_name: parsedData.fullName,
        email: parsedData.email,
        phone: parsedData.phone,
        location: parsedData.location,
        linkedin_url: parsedData.linkedin_url,
        website: parsedData.website,
        summary: parsedData.summary,
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        template_id: selectedTemplate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('cvs')
        .insert([cvData])
        .select();

      if (error) throw error;

      setSavedCVId(data[0].id);
      toast({
        title: "CV saved successfully",
        description: "Your CV has been saved to your account",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving CV:', error);
      toast({
        title: "Error saving CV",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Render upload step
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold">Upload Your CV</h3>
        <p className="text-muted-foreground">
          Upload your existing CV and we'll help you create a professional version with our templates.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium mb-2">Drop your CV here</h4>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Choose File
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, DOCX, TXT (max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Render preview step
  const renderPreviewStep = () => {
    const normalizedCV = normalizeCVData(parsedData);
    return (
      <div className="space-y-6">
        <div className="text-center">
          <FileCheck className="mx-auto h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold">Data Extracted Successfully</h3>
          <p className="text-muted-foreground">
            We've extracted the following information from your CV. Review and edit as needed.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Extracted Information</span>
              <Button variant="outline" size="sm" onClick={handleEditData}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Data
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-muted-foreground">{normalizedCV.personalInfo.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{normalizedCV.personalInfo.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">{normalizedCV.personalInfo.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{normalizedCV.personalInfo.location}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Professional Summary
              </h4>
              <p className="text-sm text-muted-foreground">{normalizedCV.summary}</p>
            </div>

            <Separator />

            {/* Skills */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {normalizedCV.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => setCurrentStep('upload')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Button>
          <Button onClick={handleChooseTemplate}>
            <Palette className="mr-2 h-4 w-4" />
            Choose Template
          </Button>
        </div>
      </div>
    );
  };

  // Render edit step
  const renderEditStep = () => {
    const normalizedCV = normalizeCVData(parsedData);
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Edit className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold">Edit Your Information</h3>
          <p className="text-muted-foreground">
            Review and edit the extracted information before proceeding.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={normalizedCV.personalInfo.fullName || ''} 
                  onChange={(e) => setParsedData(prev => prev ? {...prev, fullName: e.target.value} : null)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  value={normalizedCV.personalInfo.email || ''} 
                  onChange={(e) => setParsedData(prev => prev ? {...prev, email: e.target.value} : null)}
                  placeholder="john.doe@email.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={normalizedCV.personalInfo.phone || ''} 
                  onChange={(e) => setParsedData(prev => prev ? {...prev, phone: e.target.value} : null)}
                  placeholder="+44 123 456 7890"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input 
                  value={normalizedCV.personalInfo.location || ''} 
                  onChange={(e) => setParsedData(prev => prev ? {...prev, location: e.target.value} : null)}
                  placeholder="London, UK"
                />
              </div>
            </div>
            
            <div>
              <Label>Professional Summary</Label>
              <Textarea 
                value={normalizedCV.summary || ''} 
                onChange={(e) => setParsedData(prev => prev ? {...prev, summary: e.target.value} : null)}
                placeholder="Experienced professional with..."
                rows={4}
              />
            </div>
            
            <div>
              <Label>Skills (comma-separated)</Label>
              <Input 
                value={normalizedCV.skills.join(', ') || ''} 
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
          <Button onClick={handleChooseTemplate}>
            <Palette className="mr-2 h-4 w-4" />
            Choose Template
          </Button>
        </div>
      </div>
    );
  };

  // Render template selection step
  const renderTemplateStep = () => {
    const normalizedCV = normalizeCVData(parsedData);
    return (
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
          userTier="elite"
        />
        
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => setCurrentStep('edit')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>
          <Button onClick={handleProceedToBuilder}>
            <Eye className="mr-2 h-4 w-4" />
            Build CV
          </Button>
        </div>
      </div>
    );
  };

  // Render builder step
  const renderBuilderStep = () => {
    const normalizedCV = normalizeCVData(parsedData);
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Eye className="mx-auto h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold">Build Your CV</h3>
          <p className="text-muted-foreground">
            Customize your CV with the selected template and your extracted data.
          </p>
        </div>
        
        {parsedData && (
          <CVBuilderNew
            onClose={() => setCurrentStep('template')}
            onSuccess={() => {
              saveCVToDatabase();
              if (onSuccess) onSuccess();
            }}
          />
        )}
      </div>
    );
  };

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

export default CVUploadFlowNew; 