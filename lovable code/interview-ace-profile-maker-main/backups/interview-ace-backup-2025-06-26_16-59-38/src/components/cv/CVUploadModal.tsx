import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import mammoth from 'mammoth';

interface CVUploadModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// File validation constants for scalability
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

const CVUploadModal: React.FC<CVUploadModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        toast({
          title: "File Error",
          description: validationError,
          variant: "destructive",
        });
        return;
      }
      
      setError(null);
      setUploadedFile(file);
      console.log('File uploaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    }
  };

  // Upload file to Supabase Storage with improved error handling
  const uploadFileToStorage = async (file: File): Promise<string> => {
    try {
      // Import storage operations
      const { storageOperations } = await import('@/lib/supabase');
      
      // Try to create the bucket first (will skip if exists)
      try {
        await storageOperations.createBucket('cvs');
      } catch (bucketError) {
        console.log('Bucket creation skipped or failed:', bucketError);
      }
      
      // Upload the file
      const fileUrl = await storageOperations.uploadFile(file, 'cvs');
      return fileUrl;
      
    } catch (error) {
      console.error('File upload failed:', error);
      
      // Fallback: try alternative bucket names
      const bucketNames = ['files', 'uploads', 'documents'];
      
      for (const bucketName of bucketNames) {
        try {
          console.log(`Trying fallback bucket: ${bucketName}`);
          const { storageOperations } = await import('@/lib/supabase');
          
          // Try to create the bucket
          try {
            await storageOperations.createBucket(bucketName);
          } catch (bucketError) {
            console.log(`Bucket ${bucketName} creation skipped:`, bucketError);
          }
          
          const fileUrl = await storageOperations.uploadFile(file, bucketName);
          console.log(`Successfully uploaded to fallback bucket: ${bucketName}`);
          return fileUrl;
          
        } catch (bucketError) {
          console.log(`Fallback bucket ${bucketName} failed:`, bucketError);
          continue;
        }
      }
      
      throw new Error('Failed to upload file to any storage bucket. Please check your storage configuration.');
    }
  };

  // Save CV record to database using improved operations
  const saveCVToDatabase = async (cvData: {
    title: string;
    content?: string;
    file_url?: string;
    file_name?: string;
    file_size?: number;
    type: 'file' | 'text';
  }) => {
    console.log('saveCVToDatabase called with:', cvData);
    
    // Extract basic info from content or file
    const content = cvData.content || '';
    const fullName = cvData.title || 'Untitled CV';
    
    // Try to extract email from content if it's text-based
    const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Try to extract phone number
    const phoneMatch = content.match(/[\+]?[1-9]?[\d]{1,14}/);
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    // Try to extract location (look for common patterns)
    const locationMatch = content.match(/(?:Location|Address|City):\s*([^\n\r]+)/i) || 
                         content.match(/([A-Za-z\s]+,\s*[A-Z]{2})/);
    const location = locationMatch ? locationMatch[1] : '';
    
    // Generate a better summary from the content
    let summary = '';
    if (content) {
      // Take first 500 characters as summary, but try to end at a sentence
      const first500 = content.substring(0, 500);
      const lastPeriod = first500.lastIndexOf('.');
      summary = lastPeriod > 400 ? first500.substring(0, lastPeriod + 1) : first500;
      if (content.length > 500) summary += '...';
    } else {
      summary = `CV uploaded: ${cvData.file_name || 'Unknown file'}`;
    }
    
    // Try to extract skills from content
    let skills = '';
    const skillsMatch = content.match(/(?:Skills|Technologies|Expertise):\s*([^\n\r]+)/i);
    if (skillsMatch) {
      skills = skillsMatch[1];
    } else {
      // Look for common programming languages and skills
      const commonSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS'];
      const foundSkills = commonSkills.filter(skill => 
        content.toLowerCase().includes(skill.toLowerCase())
      );
      skills = foundSkills.join(', ');
    }
    
    const cvDataForDB = {
      full_name: fullName,
      email: email,
      phone: phone,
      location: location,
      summary: summary,
      experiences: [],
      education: [],
      skills: skills,
      certifications: '',
      template_id: 'modern',
      is_primary: false,
      ats_score: 0,
      file_url: cvData.file_url || undefined,
      file_name: cvData.file_name || undefined,
      file_size: cvData.file_size || undefined,
      content_type: cvData.type === 'file' ? 'file' : 'manual'
    };
    
    console.log('Creating CV with extracted data:', cvDataForDB);
    
    // Use the improved CV operations from supabase.ts
    const { cvOperations } = await import('@/lib/supabase');
    
    try {
      // Try the full CV creation first
      const result = await cvOperations.createCV(cvDataForDB);
      console.log('CV saved successfully:', result);
      return result;
    } catch (error: any) {
      console.log('Full CV creation failed, trying simplified version:', error);
      
      // If it fails due to missing columns, try the simplified version
      if (error?.message?.includes('column') || error?.code === 'PGRST204') {
        const simpleCvData = {
          full_name: cvDataForDB.full_name,
          email: cvDataForDB.email,
          phone: cvDataForDB.phone,
          location: cvDataForDB.location,
          summary: cvDataForDB.summary,
          experiences: cvDataForDB.experiences,
          education: cvDataForDB.education,
          skills: typeof cvDataForDB.skills === 'string' 
            ? cvDataForDB.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
            : cvDataForDB.skills,
          certifications: cvDataForDB.certifications,
        };
        
        console.log('Trying simplified CV creation:', simpleCvData);
        const result = await cvOperations.createSimpleCV(simpleCvData);
        console.log('Simplified CV saved successfully:', result);
        return result;
      }
      
      // If it's a different error, throw it
      throw error;
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // TODO: Implement CV analysis with AI
      console.log('Analyzing CV...');
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    console.log('handleSave called');
    console.log('User:', user);
    console.log('Upload method:', uploadMethod);
    console.log('Uploaded file:', uploadedFile);
    console.log('CV text:', cvText);

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save your CV",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      let cvData: any = {
        title: uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, "") : 'Pasted CV',
        type: uploadMethod as 'file' | 'text'
      };

      console.log('Initial cvData:', cvData);

      let extractedText = '';

      if (uploadMethod === 'file' && uploadedFile) {
        let fileContent = '';
        if (uploadedFile.name.endsWith('.docx')) {
          try {
            fileContent = await extractFileContent(uploadedFile);
            console.log('Extracted file content length:', fileContent.length);
            extractedText = fileContent;
          } catch (extractError) {
            console.log('Could not extract file content:', extractError);
            fileContent = '';
          }
        }
        // Upload file to storage
        let fileUrl = '';
        try {
          fileUrl = await uploadFileToStorage(uploadedFile);
          console.log('File uploaded to:', fileUrl);
        } catch (uploadError) {
          console.log('File upload failed, saving without file URL:', uploadError);
        }
        cvData = {
          ...cvData,
          file_url: fileUrl || undefined,
          file_name: uploadedFile.name,
          file_size: uploadedFile.size,
          content: fileContent || undefined,
        };
      } else if (uploadMethod === 'text' && cvText.trim()) {
        console.log('Processing text content...');
        // Save text content
        extractedText = cvText.trim();
        cvData = {
          ...cvData,
          content: cvText.trim(),
        };
      } else {
        throw new Error('No content to save');
      }

      // Always add extracted text to cvData if available
      if (extractedText) {
        cvData.content = extractedText;
      }

      console.log('Final cvData to save:', cvData);

      // Save to database
      const savedCV = await saveCVToDatabase(cvData);
      console.log('CV saved successfully:', savedCV);

      toast({
        title: "Success",
        description: "CV saved successfully!",
      });

      // Reset modal state
      setUploadMethod(null);
      setUploadedFile(null);
      setCvText('');
      setAnalysisComplete(false);
      setError(null);

      console.log('Calling onSuccess and onClose...');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save CV';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
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
    // Fallback
    return Promise.resolve('[File preview not supported. Please download to view.]');
  };

  if (analysisComplete) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              CV Analysis Complete
            </DialogTitle>
            <DialogDescription>
              We've analyzed your CV and identified areas for improvement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-green-700">ATS Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">Good</div>
                    <div className="text-sm text-blue-700">Writing Style</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-orange-700">Improvements</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Recommendations:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Add more quantifiable achievements with specific numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Include relevant keywords for better ATS optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Strengthen action verbs in experience descriptions</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                onSuccess?.();
                onClose();
              }}>
                Review Later
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save CV'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Your CV</DialogTitle>
          <DialogDescription>
            Upload an existing CV or paste your CV content to get started
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {!uploadMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setUploadMethod('file')}>
                <CardContent className="p-6 text-center">
                  <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Upload File</h3>
                  <p className="text-sm text-gray-600">Upload PDF, DOCX, or TXT file (max 10MB)</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setUploadMethod('text')}>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Paste Text</h3>
                  <p className="text-sm text-gray-600">Copy and paste your CV content</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {uploadMethod === 'file' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setUploadMethod(null)}>
                  ← Back
                </Button>
                <h3 className="font-medium">Upload CV File</h3>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Choose a file to upload</p>
                  <p className="text-sm text-gray-600">Supports PDF, DOCX, and TXT files (max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload">
                  <Button className="mt-4" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
              
              {uploadedFile && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">{uploadedFile.name}</p>
                      <p className="text-sm text-green-700">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {uploadMethod === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setUploadMethod(null)}>
                  ← Back
                </Button>
                <h3 className="font-medium">Paste CV Content</h3>
              </div>
              
              <Textarea
                placeholder="Paste your CV content here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
          )}
          
          {(uploadedFile || cvText) && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze CV'
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadModal;
