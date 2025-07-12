import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CVTemplateSelector from '@/components/cv-builder/CVTemplateSelector';
import CVForm from '@/components/cv/CVForm';
import CVPreview from '@/components/cv/CVPreview';
import { ArrowLeft, Save, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CVData } from '@/lib/supabase';
import { cvOperations } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const CVBuilderModern = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'template' | 'form' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-professional');
  const [showPreview, setShowPreview] = useState(false);
  const [cvData, setCvData] = useState<CVData>({
    id: '',
    user_id: user?.id || '',
    full_name: '',
    job_title: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    portfolio_url: '',
    summary: '',
    experiences: [],
    education: [],
    projects: [],
    skills: '',
    languages: [],
    certifications: '',
    references: [],
    template_id: 'modern-professional',
    is_primary: false,
    ats_score: 0,
    file_url: '',
    file_name: '',
    file_size: 0,
    content_type: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('form');
  };

  const handleSaveCV = async () => {
    if (!user) {
      toast.error('Please log in to save your CV');
      return;
    }

    try {
      const cvToSave = {
        ...cvData,
        template_id: selectedTemplate,
        user_id: user.id
      };

      if (cvData.id) {
        await cvOperations.updateCV(cvData.id, cvToSave);
        toast.success('CV updated successfully');
      } else {
        const newCV = await cvOperations.createCV(cvToSave);
        setCvData(prev => ({ ...prev, id: newCV.id }));
        toast.success('CV created successfully');
      }
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV: ' + error.message);
    }
  };

  const handleDownloadCV = () => {
    // TODO: Implement PDF download
    console.log('Downloading CV:', cvData);
    toast.info('PDF download feature coming soon!');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'template':
        return (
          <div className="max-w-4xl mx-auto">
            <CVTemplateSelector
              onSelectTemplate={handleTemplateSelect}
            />
          </div>
        );
      case 'form':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CVForm cvData={cvData} onDataChange={setCvData} />
            </div>
            <div className="hidden lg:block">
              <CVPreview
                cvData={cvData}
                templateId={selectedTemplate}
                showPreview={true}
                onTogglePreview={() => {}}
              />
            </div>
          </div>
        );
      case 'preview':
        return (
          <div className="max-w-4xl mx-auto">
            <CVPreview
              cvData={cvData}
              templateId={selectedTemplate}
              showPreview={true}
              onTogglePreview={() => {}}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/cvs')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to CVs
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">CV Builder</h1>
            </div>
            
            {currentStep !== 'template' && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="lg:hidden"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" onClick={handleSaveCV}>
                  <Save className="w-4 h-4 mr-2" />
                  Save CV
                </Button>
                <Button onClick={handleDownloadCV}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentStep()}
      </div>

      {/* Mobile Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">CV Preview</h3>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                ×
              </Button>
            </div>
            <div className="p-4 overflow-auto h-full">
              <CVPreview
                cvData={cvData}
                templateId={selectedTemplate}
                showPreview={true}
                onTogglePreview={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilderModern; 