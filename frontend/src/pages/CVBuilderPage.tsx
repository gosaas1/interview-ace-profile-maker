import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Download, Eye, Palette, Check, Loader2, Database, Mail, Phone, Zap } from 'lucide-react';
import CVTemplateSelector from '@/components/cv/CVTemplateSelector';
import CVForm from '@/components/cv-builder/CVForm';
import CVPreview from '@/components/cv/CVPreview';
import { cvTemplates, getTemplateById } from '@/data/cvTemplates';
import { getSampleDataForTemplate } from '@/data/sampleCVData';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { CVData } from '@/lib/cv/types';
import { supabase } from '@/lib/supabase';
import { cvOperations } from '@/lib/cv/operations';
import { cvAPI } from '@/lib/cv/api';

interface CVBuilderProps {
  // Add any props if needed
}

const CVBuilderPage: React.FC<CVBuilderProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get initial data from upload flow or use defaults
  const uploadData = location.state?.initialData;
  const fromUpload = location.state?.fromUpload;
  const initialTemplate = location.state?.selectedTemplate || 'basic-modern';

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!fromUpload);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [useSampleData, setUseSampleData] = useState(false);
  
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });

  // Load sample data when toggle is switched
  useEffect(() => {
    if (useSampleData) {
      const sampleData = getSampleDataForTemplate(selectedTemplate);
      setCvData(sampleData);
      toast.success('Sample data loaded! You can now see the live preview.');
    } else {
      // Reset to empty data
      setCvData({
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedIn: '',
          website: '',
          summary: ''
        },
        experience: [],
        education: [],
        skills: [],
        certifications: []
      });
      toast.info('Sample data disabled. Start building your own CV!');
    }
  }, [useSampleData, selectedTemplate]);

  // Auto-save functionality
  useEffect(() => {
    if (cvData && !isSaving && !useSampleData) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      const timeout = setTimeout(() => {
        autoSaveCV();
      }, 3000); // Auto-save after 3 seconds of inactivity
      
      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [cvData, useSampleData]);

  // Auto-save CV
  const autoSaveCV = async () => {
    if (!cvData || isSaving || !user || useSampleData) return;

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/cv/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...cvData,
          template: selectedTemplate,
          lastModified: new Date(),
          isDraft: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to auto-save CV');
      }

      setLastSaved(new Date());
      toast.success('CV auto-saved successfully!');
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
    
    // If sample data is enabled, load sample data for the new template
    if (useSampleData) {
      const sampleData = getSampleDataForTemplate(templateId);
      setCvData(sampleData);
    }
    
    toast.success(`Template "${getTemplateById(templateId)?.name}" selected`);
  };

  // Save CV
  const handleSaveCV = async () => {
    if (!user) {
      toast.error('Please log in to save your CV');
      return;
    }

    if (useSampleData) {
      toast.error('Cannot save sample data. Please disable sample data mode to save your own CV.');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/cv/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...cvData,
          template: selectedTemplate,
          lastModified: new Date(),
          isDraft: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save CV');
      }

      setLastSaved(new Date());
      toast.success('CV saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save CV. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Download CV
  const handleDownloadCV = () => {
    // Here you would implement PDF generation and download
    toast.info('PDF download feature coming soon!');
  };

  // Preview CV
  const handlePreviewCV = () => {
    // Here you would show a preview modal
    toast.info('Preview feature coming soon!');
  };

  const currentTemplate = getTemplateById(selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">CV Builder</h1>
                {currentTemplate && (
                  <p className="text-sm text-gray-500">
                    Template: {currentTemplate.name}
                  </p>
                )}
                {lastSaved && !useSampleData && (
                  <p className="text-xs text-green-600">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sample Data Toggle */}
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Sample Data</span>
                <Switch
                  checked={useSampleData}
                  onCheckedChange={setUseSampleData}
                  className="ml-2"
                />
              </div>

              {fromUpload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center space-x-2"
                >
                  <Palette className="h-4 w-4" />
                  <span>Change Template</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewCV}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCV}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              
              <Button
                onClick={handleSaveCV}
                disabled={isSaving || useSampleData}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save CV
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showTemplateSelector ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Template
              </h2>
              <p className="text-gray-600">
                Select a professional template to get started with your CV
              </p>
            </div>
            
            <CVTemplateSelector
              onSelectTemplate={handleTemplateSelect}
              userTier="elite"
              showAllTemplates={true}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sample Data Notice */}
            {useSampleData && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Sample Data Mode</h4>
                      <p className="text-sm text-blue-800">
                        You're viewing sample data to see how your CV will look. 
                        Toggle off to start building your own CV.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CV Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>CV Builder</span>
                  {useSampleData && (
                    <Badge variant="secondary" className="ml-2">
                      Sample Data
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {useSampleData 
                    ? "View sample data to see how your CV will look with this template"
                    : "Fill in your information to create a professional CV"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVForm
                  cvData={cvData}
                  onDataChange={setCvData}
                />
              </CardContent>
            </Card>

            {/* Template Info */}
            {currentTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    <span>Template Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Template</h4>
                      <p className="text-gray-600">{currentTemplate.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">ATS Score</h4>
                      <Badge variant="outline" className="text-green-600">
                        {currentTemplate.atsScore || 95}%
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Category</h4>
                      <Badge variant="outline">
                        {currentTemplate.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilderPage; 