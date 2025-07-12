import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CVBuilderStepper, defaultSteps, StepData } from './CVBuilderStepper';
import CVPreview from './CVPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Save, X, ArrowLeft, ArrowRight, Eye, EyeOff, TestTube, Palette } from 'lucide-react';
import { CVData, cvOperations } from '@/lib/supabase';
import { getSampleDataForTemplate, getTemplateNames } from '@/data/sampleCVData';
import { testCVData, testCVDataAlternative, testCVDataMinimal } from '@/data/testCVData';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { SimpleTemplateSelector } from '@/components/cv/SimpleTemplateSelector';
import { LiveCVPreview } from '@/components/cv/LiveCVPreview';

// Step Components
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ProjectsStep } from './steps/ProjectsStep';
import { CertificationsStep } from './steps/CertificationsStep';
import { ReferencesStep } from './steps/ReferencesStep';
import { TemplateStep } from './steps/TemplateStep';
import { PreviewStep } from './steps/PreviewStep';
import { getTemplateById, cvTemplates } from '@/data/cvTemplates';

interface CVBuilderModernProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingCV?: CVData;
  isModal?: boolean;
}

export interface CVFormData {
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  summary: string;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url: string;
  }>;
  skills: string;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: string;
  references: Array<{
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }>;
}

export const CVBuilderModern: React.FC<CVBuilderModernProps> = ({
  onClose,
  onSuccess,
  editingCV,
  isModal = false
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<StepData[]>(defaultSteps);
  const [selectedTemplate, setSelectedTemplate] = useState('basic-modern');
  const [showPreview, setShowPreview] = useState(true);
  const [useTestData, setUseTestData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<CVFormData>({
    full_name: '',
    job_title: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    portfolio_url: '',
    summary: '',
    experiences: [{ company: '', role: '', duration: '', description: '' }],
    education: [{ institution: '', degree: '', year: '', gpa: '' }],
    projects: [{ name: '', description: '', technologies: '', url: '' }],
    skills: '',
    languages: [{ language: '', proficiency: '' }],
    certifications: '',
    references: [{ name: '', title: '', company: '', email: '', phone: '' }]
  });

  // User's actual data (when not using test data)
  const [userFormData, setUserFormData] = useState<CVFormData>(formData);

  // Initialize form data
  useEffect(() => {
    if (editingCV) {
      const initialData: CVFormData = {
        full_name: editingCV.full_name || '',
        job_title: editingCV.job_title || '',
        email: editingCV.email || '',
        phone: editingCV.phone || '',
        location: editingCV.location || '',
        linkedin_url: editingCV.linkedin_url || '',
        portfolio_url: editingCV.portfolio_url || '',
        summary: editingCV.summary || '',
        experiences: editingCV.experiences || [{ company: '', role: '', duration: '', description: '' }],
        education: editingCV.education || [{ institution: '', degree: '', year: '', gpa: '' }],
        projects: editingCV.projects || [{ name: '', description: '', technologies: '', url: '' }],
        skills: editingCV.skills || '',
        languages: editingCV.languages || [{ language: '', proficiency: '' }],
        certifications: editingCV.certifications || '',
        references: editingCV.references || [{ name: '', title: '', company: '', email: '', phone: '' }]
      };
      setFormData(initialData);
      setUserFormData(initialData);
      if (editingCV.template_id) {
        setSelectedTemplate(editingCV.template_id);
      }
      setCurrentCVId(editingCV.id);
    }
  }, [editingCV]);

  // Handle test data toggle
  useEffect(() => {
    if (useTestData) {
      const sampleData = getSampleDataForTemplate(selectedTemplate) as CVFormData;
      setFormData(sampleData);
    } else {
      setFormData(userFormData);
    }
  }, [useTestData, selectedTemplate, userFormData]);

  // Populate test data function
  const populateTestData = (dataType: 'full' | 'alternative' | 'minimal' = 'full') => {
    let testData: CVFormData;
    
    switch (dataType) {
      case 'alternative':
        testData = testCVDataAlternative as CVFormData;
        break;
      case 'minimal':
        testData = testCVDataMinimal as CVFormData;
        break;
      default:
        testData = testCVData as CVFormData;
    }
    
    setFormData(testData);
    setUserFormData(testData);
    setUseTestData(false); // Turn off test data mode so user can edit
    toast.success('Test data populated! You can now edit the fields.');
  };

  // Update form data
  const updateFormData = (updates: Partial<CVFormData>) => {
    if (useTestData) {
      // Don't update when using test data
      toast.info('Switch off "Show Example" to edit your CV');
      return;
    }
    setFormData(prev => ({ ...prev, ...updates }));
    setUserFormData(prev => ({ ...prev, ...updates }));
  };

  // Handle step navigation
  const goToStep = (stepIndex: number) => {
    if (steps[stepIndex]?.isAccessible) {
      setCurrentStep(stepIndex);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed and make next step accessible
      const newSteps = [...steps];
      newSteps[currentStep].isCompleted = true;
      if (currentStep + 1 < steps.length) {
        newSteps[currentStep + 1].isAccessible = true;
      }
      setSteps(newSteps);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (useTestData) {
      const sampleData = getSampleDataForTemplate(templateId) as CVFormData;
      setFormData(sampleData);
    }
  };

  // Save CV
  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save your CV');
      return;
    }

    if (useTestData) {
      toast.error('Please switch off "Show Example" before saving');
      return;
    }

    setLoading(true);
    try {
      const cvData = {
        title: formData.full_name || 'Untitled CV',
        content: formData,
        is_public: false
      };

      if (editingCV) {
        const { data, error } = await cvOperations.updateCV(editingCV.id, cvData as any);
        if (error) throw error;
        toast.success('CV updated successfully!');
      } else {
        const { data, error } = await cvOperations.createCV(cvData as any);
        if (error) throw error;
        setCurrentCVId(data.id);
        toast.success('CV created successfully!');
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast.error(error.message || 'Failed to save CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
      isFirst: currentStep === 0,
      isLast: currentStep === steps.length - 1
    };

    switch (steps[currentStep]?.id) {
      case 'template':
        return <TemplateStep 
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          onNext={nextStep}
          onPrev={prevStep}
          userTier={'free'}
          isFirst={true}
        />;
      case 'personal':
        return <PersonalInfoStep {...stepProps} />;
      case 'experience':
        return <ExperienceStep {...stepProps} />;
      case 'education':
        return <EducationStep {...stepProps} />;
      case 'skills':
        return <SkillsStep {...stepProps} />;
      case 'projects':
        return <ProjectsStep {...stepProps} />;
      case 'certifications':
        return <CertificationsStep {...stepProps} />;
      case 'references':
        return <ReferencesStep {...stepProps} />;
      case 'preview':
        return <PreviewStep 
          {...stepProps} 
          cvData={formData as any}
          templateId={selectedTemplate}
          onSave={handleSave}
          loading={loading}
        />;
      default:
        return <div>Step not found</div>;
    }
  };

  const containerClass = isModal 
    ? "max-h-[90vh] overflow-hidden flex flex-col"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {editingCV ? 'Edit CV' : 'Create CV'}
              </h1>
              
              {/* Template Selector Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100 transition-all duration-200"
              >
                <Palette className="w-4 h-4 mr-2" />
                {getTemplateById(selectedTemplate)?.name || 'Template'}
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Preview Toggle (Mobile) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden bg-white/80 hover:bg-white"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              
              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={loading || useTestData}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : (editingCV ? 'Update' : 'Save')}
              </Button>
              
              {/* Close Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="bg-white/80 hover:bg-white border-gray-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Test Data Toggle */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-sm rounded-lg px-4 py-2 border border-amber-200/50">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <Label htmlFor="test-data-toggle" className="text-sm font-medium text-amber-800">
                  Show Example
                </Label>
                <Switch
                  id="test-data-toggle"
                  checked={useTestData}
                  onCheckedChange={setUseTestData}
                />
              </div>

              {/* Test Data Dropdown */}
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
                  title="Populate with test data"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Data
                  <span className="ml-2 text-xs">▼</span>
                </Button>
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[180px] overflow-hidden">
                  <div className="p-2">
                    <button
                      onClick={() => populateTestData('full')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <div className="font-medium text-gray-900">Full Data</div>
                      <div className="text-xs text-gray-500">Complete CV example</div>
                    </button>
                    <button
                      onClick={() => populateTestData('alternative')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <div className="font-medium text-gray-900">UX Designer</div>
                      <div className="text-xs text-gray-500">Design-focused example</div>
                    </button>
                    <button
                      onClick={() => populateTestData('minimal')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <div className="font-medium text-gray-900">Minimal Data</div>
                      <div className="text-xs text-gray-500">Basic structure only</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="container mx-auto px-4 py-6">
        <CVBuilderStepper
          currentStep={currentStep}
          steps={steps}
          onStepClick={goToStep}
        />
      </div>

      {/* Main Content */}
      <div className={`container mx-auto px-4 pb-6 ${isModal ? 'flex-1 overflow-hidden' : ''}`}>
        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <div className="mb-6">
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Choose Template</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateSelector(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleTemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={(templateId) => {
                    setSelectedTemplate(templateId);
                    setShowTemplateSelector(false);
                    toast.success(`Template changed to ${getTemplateById(templateId)?.name}`);
                  }}
                  userTier="elite" // For development - show all templates
                />
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Form Section */}
          <div className={`space-y-6 ${isModal ? 'overflow-y-auto' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <LiveCVPreview
                formData={formData}
                selectedTemplate={selectedTemplate}
                className="bg-white/50 backdrop-blur-md border-white/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 