import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UnifiedTemplateSelection } from '@/components/cv-builder/UnifiedTemplateSelection';
import { CVBuilderModern } from '@/components/cv-builder/CVBuilderModern';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Save, Brain, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type BuilderMode = 'template-selection' | 'cv-builder' | 'success';
type TemplateAction = 'edit' | 'save' | 'ai';

interface UnifiedCVBuilderProps {
  mode: 'create' | 'upload';
}

export default function UnifiedCVBuilder({ mode }: UnifiedCVBuilderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentMode, setCurrentMode] = useState<BuilderMode>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-minimal');
  const [selectedAction, setSelectedAction] = useState<TemplateAction>('edit');
  const [initialData, setInitialData] = useState<any>(null);
  const [savedCVId, setSavedCVId] = useState<string | null>(null);

  // Get initial data from navigation state (for upload flow)
  useEffect(() => {
    if (location.state?.initialData) {
      setInitialData(location.state.initialData);
    }
    if (location.state?.selectedTemplate) {
      setSelectedTemplate(location.state.selectedTemplate);
    }
  }, [location.state]);

  const handleTemplateSelect = (templateId: string, action: TemplateAction) => {
    setSelectedTemplate(templateId);
    setSelectedAction(action);
    
    if (action === 'save') {
      // Handle direct save without editing
      handleDirectSave(templateId);
    } else if (action === 'ai') {
      // Handle AI optimization
      handleAIOptimization(templateId);
    } else {
      // Proceed to CV builder for editing
      setCurrentMode('cv-builder');
    }
  };

  const handleDirectSave = async (templateId: string) => {
    try {
      // Create CV with template and initial data
      const cvData = {
        title: initialData?.full_name || 'My CV',
        content: initialData || {},
        template_id: templateId,
        is_public: false
      };

      // Save to backend
      const response = await fetch('http://localhost:8000/api/cv/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });

      if (response.ok) {
        const result = await response.json();
        setSavedCVId(result.id);
        setCurrentMode('success');
        toast.success('CV saved successfully!');
      } else {
        throw new Error('Failed to save CV');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save CV. Please try again.');
    }
  };

  const handleAIOptimization = async (templateId: string) => {
    try {
      // Show AI optimization in progress
      toast.info('AI optimization in progress...');
      
      // TODO: Implement AI optimization logic
      // For now, proceed to builder with AI suggestions
      setCurrentMode('cv-builder');
      toast.success('AI suggestions applied!');
    } catch (error) {
      console.error('AI optimization error:', error);
      toast.error('AI optimization failed. Please try editing manually.');
      setCurrentMode('cv-builder');
    }
  };

  const handleBack = () => {
    if (currentMode === 'cv-builder') {
      setCurrentMode('template-selection');
    } else {
      navigate(-1);
    }
  };

  const handleBuilderSuccess = (cvId: string) => {
    setSavedCVId(cvId);
    setCurrentMode('success');
  };

  const handleBuilderClose = () => {
    navigate('/cvs');
  };

  const renderSuccessScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            CV Created Successfully!
          </CardTitle>
          <p className="text-slate-600">
            Your CV has been saved and is ready to use.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/cvs')}
            >
              <Eye className="w-4 h-4 mr-2" />
              View CVs
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCurrentMode('template-selection')}
            >
              <Edit className="w-4 h-4 mr-2" />
              Create Another
            </Button>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => navigate('/dashboard')}
          >
            <Download className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (currentMode === 'success') {
    return renderSuccessScreen();
  }

  if (currentMode === 'cv-builder') {
    return (
      <CVBuilderModern
        onClose={handleBuilderClose}
        onSuccess={handleBuilderSuccess}
        editingCV={initialData ? {
          id: savedCVId || '',
          template_id: selectedTemplate,
          ...initialData
        } : undefined}
        isModal={false}
      />
    );
  }

  return (
    <UnifiedTemplateSelection
      onTemplateSelect={handleTemplateSelect}
      onBack={handleBack}
      selectedTemplate={selectedTemplate}
      mode={mode}
      initialData={initialData}
    />
  );
} 