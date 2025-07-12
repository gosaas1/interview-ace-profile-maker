import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Download, Eye, Palette, Check } from 'lucide-react';
import { CVBuilderModern } from '@/components/cv-builder/CVBuilderModern';
import { CVTemplateSelector } from '@/components/cv/CVTemplateSelector';
import { cvTemplates, getTemplateById } from '@/data/cvTemplates';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

interface CVBuilderProps {
  // Add any props if needed
}

const CVBuilder: React.FC<CVBuilderProps> = () => {
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

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
    toast.success(`Template "${getTemplateById(templateId)?.name}" selected`);
  };

  // Save CV
  const handleSaveCV = async () => {
    if (!user) {
      toast.error('Please log in to save your CV');
      return;
    }

    setIsSaving(true);
    try {
      // Here you would save the CV data to your backend
      // For now, we'll just show a success message
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
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              userTier="elite" // Show all templates for now
              showAllTemplates={true}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* CV Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>CV Builder</span>
                </CardTitle>
                <CardDescription>
                  Fill in your information to create a professional CV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVBuilderModern
                  onClose={() => navigate(-1)}
                  onSuccess={() => {
                    toast.success('CV created successfully!');
                    navigate('/cvs');
                  }}
                  isModal={false}
                />
              </CardContent>
            </Card>

            {/* Template Info */}
            {currentTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">{currentTemplate.name}</h4>
                    <p className="text-sm text-gray-600">{currentTemplate.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentTemplate.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {currentTemplate.atsScore && (
                    <div>
                      <p className="text-sm font-medium">ATS Score:</p>
                      <Badge variant="secondary" className="text-xs">
                        {currentTemplate.atsScore}%
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilder; 