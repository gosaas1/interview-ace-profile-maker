import React, { useState, useEffect } from 'react';
import { cvOperations, CVData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CVFormFields } from './CVFormFields';

import CVPreview from './CVPreview';
import { CVAnalysis } from './CVAnalysis';
import { Eye, EyeOff, Palette, Save, Download, Brain, CheckCircle, AlertCircle, Plus, X, Languages } from 'lucide-react';
import { getTemplateById, getTemplatesByTier } from '@/data/cvTemplates';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Linkedin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { normalizeCVData } from '@/lib/cv/normalize';

interface CVBuilderProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingCV?: CVData;
}

type ViewMode = 'form' | 'template' | 'preview' | 'analysis';

// Create separate step components
const PersonalInfoStep = ({ formData, onInputChange }: { formData: any, onInputChange: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <Input name="fullName" value={formData.personalInfo.fullName} onChange={onInputChange} placeholder="John Doe" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
        <Input name="jobTitle" value={formData.personalInfo.jobTitle || ''} onChange={onInputChange} placeholder="Software Engineer" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <Input name="email" type="email" value={formData.personalInfo.email} onChange={onInputChange} placeholder="john.doe@email.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <Input name="phone" value={formData.personalInfo.phone} onChange={onInputChange} placeholder="+1 (555) 123-4567" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <Input name="location" value={formData.personalInfo.location} onChange={onInputChange} placeholder="New York, NY" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Linkedin className="h-4 w-4 mr-1" />LinkedIn URL</label>
        <Input name="linkedIn" value={formData.personalInfo.linkedIn} onChange={onInputChange} placeholder="https://linkedin.com/in/johndoe" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Globe className="h-4 w-4 mr-1" />Portfolio/Website URL</label>
      <Input name="website" value={formData.personalInfo.website} onChange={onInputChange} placeholder="https://johndoe.com" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
      <Textarea name="summary" value={formData.personalInfo.summary} onChange={onInputChange} placeholder="A brief overview of your professional background, key skills, and career objectives..." rows={4} />
    </div>
  </div>
);

const ExperienceStep = ({ formData, onExperienceChange, onAddExperience, onRemoveExperience }: { formData: any, onExperienceChange: any, onAddExperience: any, onRemoveExperience: any }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Work Experience</h3>
      <Button onClick={onAddExperience} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
    {formData.experience.map((exp: any, index: number) => (
      <Card key={index} className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium">Experience {index + 1}</h4>
          {formData.experience.length > 1 && (
            <Button variant="ghost" size="sm" onClick={() => onRemoveExperience(index)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <Input
            placeholder="Company Name"
            value={exp.company}
            onChange={(e) => onExperienceChange(index, 'company', e.target.value)}
          />
          <Input
            placeholder="Job Title"
            value={exp.role}
            onChange={(e) => onExperienceChange(index, 'role', e.target.value)}
          />
          <Input
            placeholder="Duration (e.g., Jan 2020 - Present)"
            value={exp.duration}
            onChange={(e) => onExperienceChange(index, 'duration', e.target.value)}
          />
        </div>
        <Textarea
          placeholder="Describe your role, responsibilities, and achievements..."
          value={exp.description}
          onChange={(e) => onExperienceChange(index, 'description', e.target.value)}
          rows={3}
        />
      </Card>
    ))}
  </div>
);

const EducationStep = ({ formData, onEducationChange, onAddEducation, onRemoveEducation }: { formData: any, onEducationChange: any, onAddEducation: any, onRemoveEducation: any }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Education</h3>
      <Button onClick={onAddEducation} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
    {formData.education.map((edu: any, index: number) => (
      <Card key={index} className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium">Education {index + 1}</h4>
          {formData.education.length > 1 && (
            <Button variant="ghost" size="sm" onClick={() => onRemoveEducation(index)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Institution Name"
            value={edu.institution}
            onChange={(e) => onEducationChange(index, 'institution', e.target.value)}
          />
          <Input
            placeholder="Degree/Course"
            value={edu.degree}
            onChange={(e) => onEducationChange(index, 'degree', e.target.value)}
          />
          <Input
            placeholder="Year"
            value={edu.year}
            onChange={(e) => onEducationChange(index, 'year', e.target.value)}
          />
          <Input
            placeholder="GPA (optional)"
            value={edu.gpa}
            onChange={(e) => onEducationChange(index, 'gpa', e.target.value)}
          />
        </div>
      </Card>
    ))}
  </div>
);

const SkillsStep = ({ formData, onInputChange, onProjectChange, onAddProject, onRemoveProject, onLanguageChange, onAddLanguage, onRemoveLanguage }: { formData: any, onInputChange: any, onProjectChange: any, onAddProject: any, onRemoveProject: any, onLanguageChange: any, onAddLanguage: any, onRemoveLanguage: any }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
      <Textarea
        name="summary"
        value={formData.summary}
        onChange={onInputChange}
        placeholder="A brief overview of your professional background, key skills, and career objectives..."
        rows={4}
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Skills & Technologies</label>
      <Textarea
        name="skills"
        value={formData.skills}
        onChange={onInputChange}
        placeholder="e.g., JavaScript, React, Node.js, Python, AWS, Docker, Git, Agile methodologies..."
        rows={3}
      />
    </div>

    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Projects</label>
        <Button onClick={onAddProject} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>
      {formData.projects.map((project: any, index: number) => (
        <Card key={index} className="p-4 mb-3">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">Project {index + 1}</h4>
            {formData.projects.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => onRemoveProject(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Input
              placeholder="Project Name"
              value={project.name}
              onChange={(e) => onProjectChange(index, 'name', e.target.value)}
            />
            <Input
              placeholder="Technologies Used"
              value={project.technologies}
              onChange={(e) => onProjectChange(index, 'technologies', e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Project description and your role..."
            value={project.description}
            onChange={(e) => onProjectChange(index, 'description', e.target.value)}
            rows={2}
          />
          <Input
            placeholder="Project URL (optional)"
            value={project.url}
            onChange={(e) => onProjectChange(index, 'url', e.target.value)}
            className="mt-2"
          />
        </Card>
      ))}
    </div>

    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          <Languages className="h-4 w-4 mr-1" />
          Languages
        </label>
        <Button onClick={onAddLanguage} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Language
        </Button>
      </div>
      {formData.languages.map((lang: any, index: number) => (
        <Card key={index} className="p-3 mb-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Language"
                value={lang.language}
                onChange={(e) => onLanguageChange(index, 'language', e.target.value)}
                className="flex-1"
              />
              <Select value={lang.proficiency} onValueChange={(value) => onLanguageChange(index, 'proficiency', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Native">Native</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.languages.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => onRemoveLanguage(index)} className="ml-2">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
      <Textarea
        name="certifications"
        value={formData.certifications}
        onChange={onInputChange}
        placeholder="List any relevant certifications, licenses, or professional memberships..."
        rows={3}
      />
    </div>
  </div>
);

export const CVBuilderRefactored: React.FC<CVBuilderProps> = ({ onClose, onSuccess, editingCV }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userTier, setUserTier] = useState('free');
  const [showPreview, setShowPreview] = useState(false);
  // Correctly initialize formData state using the editingCV prop
  const [formData, setFormData] = useState<CVData>(normalizeCVData(editingCV || {}));

  useEffect(() => {
    checkAuth();
    getUserTier();
    if (editingCV) {
      populateFormData(editingCV);
    }
  }, [editingCV]);

  const checkAuth = async () => {
    if (!user) {
      toast.error('Please sign in to create a CV');
      onClose();
    }
  };

  const getUserTier = async () => {
    // TODO: Implement proper tier detection
    setUserTier('free');
  };

  const populateFormData = (cv: CVData) => {
    setFormData(cv);
  };

  // Update PersonalInfoStep to use canonical structure
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["fullName", "jobTitle", "email", "phone", "location", "linkedIn", "website", "summary"].includes(name)) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Update all experience/education/projects/skills handlers to use canonical structure
  const handleExperienceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: String(Date.now()), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: String(Date.now()), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects?.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { id: String(Date.now()), name: '', description: '', technologies: '', url: '' }
      ]
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages?.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        { id: String(Date.now()), language: '', proficiency: '' }
      ]
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index)
    }));
  };

  const handleReferenceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references?.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [
        ...(prev.references || []),
        { id: String(Date.now()), name: '', title: '', company: '', email: '', phone: '', relationship: '' }
      ]
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: (prev.references || []).filter((_, i) => i !== index)
    }));
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setViewMode('preview');
  };

  const generateCVText = (): string => {
    const normalizedCV = normalizeCVData(formData);
    let cvText = '';
    
    // Personal Information
    cvText += `${normalizedCV.personalInfo.fullName}\n`;
    if (normalizedCV.personalInfo.jobTitle) cvText += `${normalizedCV.personalInfo.jobTitle}\n`;
    if (normalizedCV.personalInfo.email) cvText += `${normalizedCV.personalInfo.email}\n`;
    if (normalizedCV.personalInfo.phone) cvText += `${normalizedCV.personalInfo.phone}\n`;
    if (normalizedCV.personalInfo.location) cvText += `${normalizedCV.personalInfo.location}\n`;
    if (normalizedCV.personalInfo.linkedinUrl) cvText += `${normalizedCV.personalInfo.linkedinUrl}\n`;
    if (normalizedCV.personalInfo.portfolioUrl) cvText += `${normalizedCV.personalInfo.portfolioUrl}\n\n`;
    
    // Summary
    if (normalizedCV.summary) {
      cvText += `PROFESSIONAL SUMMARY\n${normalizedCV.summary}\n\n`;
    }
    
    // Experience
    if (normalizedCV.experience.length > 0 && normalizedCV.experience[0].company) {
      cvText += `WORK EXPERIENCE\n`;
      normalizedCV.experience.forEach(exp => {
        if (exp.company) {
          cvText += `${exp.role} at ${exp.company}\n`;
          if (exp.duration) cvText += `${exp.duration}\n`;
          if (exp.description) cvText += `${exp.description}\n\n`;
        }
      });
    }
    
    // Education
    if (normalizedCV.education.length > 0 && normalizedCV.education[0].institution) {
      cvText += `EDUCATION\n`;
      normalizedCV.education.forEach(edu => {
        if (edu.institution) {
          cvText += `${edu.degree} from ${edu.institution}\n`;
          if (edu.year) cvText += `${edu.year}\n`;
          if (edu.gpa) cvText += `GPA: ${edu.gpa}\n\n`;
        }
      });
    }
    
    // Skills
    if (normalizedCV.skills) {
      cvText += `SKILLS\n${normalizedCV.skills}\n\n`;
    }
    
    // Projects
    if (normalizedCV.projects.length > 0 && normalizedCV.projects[0].name) {
      cvText += `PROJECTS\n`;
      normalizedCV.projects.forEach(project => {
        if (project.name) {
          cvText += `${project.name}\n`;
          if (project.technologies) cvText += `Technologies: ${project.technologies}\n`;
          if (project.description) cvText += `${project.description}\n`;
          if (project.url) cvText += `URL: ${project.url}\n\n`;
        }
      });
    }
    
    // Languages
    if (normalizedCV.languages.length > 0 && normalizedCV.languages[0].language) {
      cvText += `LANGUAGES\n`;
      normalizedCV.languages.forEach(lang => {
        if (lang.language) {
          cvText += `${lang.language}: ${lang.proficiency}\n`;
        }
      });
      cvText += '\n';
    }
    
    // Certifications
    if (normalizedCV.certifications) {
      cvText += `CERTIFICATIONS\n${normalizedCV.certifications}\n\n`;
    }
    
    return cvText;
  };

  const validateForm = (): boolean => {
    const normalizedCV = normalizeCVData(formData);
    if (!normalizedCV.personalInfo.fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }
    if (!normalizedCV.personalInfo.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const normalizedCV = normalizeCVData(formData);
      const cvData = {
        ...normalizedCV,
        user_id: user!.id,
        template_id: selectedTemplate?.id || null
      };
      
      if (editingCV) {
        await cvOperations.updateCV(editingCV.id, cvData);
        toast.success('CV updated successfully');
      } else {
        await cvOperations.createCV(cvData);
        toast.success('CV created successfully');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV');
    } finally {
      setIsLoading(false);
    }
  };

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goToStep = (idx: number) => setCurrentStep(idx);

  // Placeholder functions for unused props
  const noop = () => {};
  const noopIndex = (_: number) => {};
  const noopField = (_: number, __: string, ___: string) => {};

  const renderStepContent = () => {
    const StepComponent = steps[currentStep].component;
    const props = {
      formData,
      onInputChange: handleInputChange,
      onExperienceChange: handleExperienceChange,
      onAddExperience: addExperience,
      onRemoveExperience: removeExperience,
      onEducationChange: handleEducationChange,
      onAddEducation: addEducation,
      onRemoveEducation: removeEducation,
      onProjectChange: handleProjectChange,
      onAddProject: addProject,
      onRemoveProject: removeProject,
      onLanguageChange: handleLanguageChange,
      onAddLanguage: addLanguage,
      onRemoveLanguage: removeLanguage,
      onReferenceChange: handleReferenceChange,
      onAddReference: addReference,
      onRemoveReference: removeReference
    };
    
    return <StepComponent {...props} />;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingCV ? 'Edit CV' : 'Create New CV'}
          </DialogTitle>
          <DialogDescription>
            Build your professional CV step by step
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    currentStep === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                size="sm"
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode('template')}
                size="sm"
              >
                <Palette className="h-4 w-4 mr-1" />
                Templates
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-6">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={goNext}>
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save CV'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-2">Preview</h3>
                <div className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {generateCVText() || 'Start filling out the form to see a preview...'}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 