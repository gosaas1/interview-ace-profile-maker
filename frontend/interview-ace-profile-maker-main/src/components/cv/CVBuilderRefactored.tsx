import React, { useState, useEffect } from 'react';
import { cvOperations, CVData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CVFormFields } from './CVFormFields';
import { CVTemplateSelector } from './CVTemplateSelector';
import { CVPreview } from './CVPreview';
import { CVAnalysis } from './CVAnalysis';
import { Eye, EyeOff, Palette, Save, Download, Brain, CheckCircle, AlertCircle, Plus, X, Languages } from 'lucide-react';
import { getTemplateById, getTemplatesByTier } from '@/data/cvTemplates';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Linkedin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface CVBuilderProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingCV?: CVData;
}

// Aligned form data structure with database schema
interface CVFormData {
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

type ViewMode = 'form' | 'template' | 'preview' | 'analysis';

// Create separate step components
const PersonalInfoStep = ({ formData, onInputChange }: { formData: any, onInputChange: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <Input name="full_name" value={formData.full_name} onChange={onInputChange} placeholder="John Doe" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
        <Select value={formData.job_title} onValueChange={(value) => onInputChange({ target: { name: 'job_title', value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select job title" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Software Engineer">Software Engineer</SelectItem>
            <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
            <SelectItem value="Backend Developer">Backend Developer</SelectItem>
            <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
            <SelectItem value="Data Scientist">Data Scientist</SelectItem>
            <SelectItem value="Product Manager">Product Manager</SelectItem>
            <SelectItem value="UX Designer">UX Designer</SelectItem>
            <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
            <SelectItem value="QA Engineer">QA Engineer</SelectItem>
            <SelectItem value="Project Manager">Project Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <Input name="email" type="email" value={formData.email} onChange={onInputChange} placeholder="john.doe@email.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <Input name="phone" value={formData.phone} onChange={onInputChange} placeholder="+1 (555) 123-4567" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <Input name="location" value={formData.location} onChange={onInputChange} placeholder="New York, NY" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Linkedin className="h-4 w-4 mr-1" />LinkedIn URL</label>
        <Input name="linkedin_url" value={formData.linkedin_url} onChange={onInputChange} placeholder="https://linkedin.com/in/johndoe" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Globe className="h-4 w-4 mr-1" />Portfolio/Website URL</label>
      <Input name="portfolio_url" value={formData.portfolio_url} onChange={onInputChange} placeholder="https://johndoe.com" />
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
    {formData.experiences.map((exp: any, index: number) => (
      <Card key={index} className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium">Experience {index + 1}</h4>
          {formData.experiences.length > 1 && (
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
            placeholder="Year (e.g., 2020)"
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
    <h3 className="text-xl font-semibold">Skills & Additional Information</h3>
    
    {/* Skills with auto-suggestions */}
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Textarea
            name="skills"
            value={formData.skills}
            onChange={onInputChange}
            placeholder="List your technical and soft skills, separated by commas..."
            rows={3}
          />
          <div className="flex flex-wrap gap-2">
            {['JavaScript', 'React', 'TypeScript', 'Python', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker', 'Agile'].map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentSkills = formData.skills || '';
                  const newSkills = currentSkills ? `${currentSkills}, ${skill}` : skill;
                  onInputChange({ target: { name: 'skills', value: newSkills } });
                }}
              >
                + {skill}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Projects */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Projects
          <Button onClick={onAddProject} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.projects.map((project: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Project {index + 1}</h4>
              {formData.projects.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => onRemoveProject(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => onProjectChange(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Project URL (optional)"
                value={project.url}
                onChange={(e) => onProjectChange(index, 'url', e.target.value)}
              />
            </div>
            <Input
              placeholder="Technologies Used"
              value={project.technologies}
              onChange={(e) => onProjectChange(index, 'technologies', e.target.value)}
            />
            <Textarea
              placeholder="Project description and achievements..."
              value={project.description}
              onChange={(e) => onProjectChange(index, 'description', e.target.value)}
              rows={3}
            />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Languages */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            Languages
          </span>
          <Button onClick={onAddLanguage} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.languages.map((language: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">Language {index + 1}</h4>
              {formData.languages.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => onRemoveLanguage(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Language"
                value={language.language}
                onChange={(e) => onLanguageChange(index, 'language', e.target.value)}
              />
              <Select
                value={language.proficiency}
                onValueChange={(value) => onLanguageChange(index, 'proficiency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Proficiency Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Native">Native</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export const CVBuilderRefactored: React.FC<CVBuilderProps> = ({ onClose, onSuccess, editingCV }) => {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('basic-modern');
  const [userTier, setUserTier] = useState('free');
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { user } = useAuth();
  
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

  // Add stepper state
  const steps = [
    'Template',
    'Personal Info',
    'Experience',
    'Education',
    'Skills & More',
    'Summary',
    'AI Suggestions',
    'Preview & Save'
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    checkAuth();
    getUserTier();
    if (editingCV) {
      populateFormData(editingCV);
    }
  }, [editingCV]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to create a CV');
      onClose();
    }
  };

  const getUserTier = async () => {
    // TODO: Implement proper tier detection from user profile/subscription
    // For now, default to free tier as per business logic
    setUserTier('free');
  };

  const populateFormData = (cv: CVData) => {
    setFormData({
      full_name: cv.full_name || '',
      job_title: cv.job_title || '',
      email: cv.email || '',
      phone: cv.phone || '',
      location: cv.location || '',
      linkedin_url: cv.linkedin_url || '',
      portfolio_url: cv.portfolio_url || '',
      summary: cv.summary || '',
      experiences: cv.experiences || [{ company: '', role: '', duration: '', description: '' }],
      education: cv.education || [{ institution: '', degree: '', year: '', gpa: '' }],
      projects: cv.projects || [{ name: '', description: '', technologies: '', url: '' }],
      skills: cv.skills || '',
      languages: cv.languages || [{ language: '', proficiency: '' }],
      certifications: cv.certifications || '',
      references: cv.references || [{ name: '', title: '', company: '', email: '', phone: '' }]
    });
    if (cv.template_id) {
      setSelectedTemplate(cv.template_id);
    }
    setCurrentCVId(cv.id);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
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

  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const handleReferenceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  // Array manipulation handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: '', role: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    if (formData.experiences.length > 1) {
      setFormData(prev => ({
        ...prev,
        experiences: prev.experiences.filter((_, i) => i !== index)
      }));
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', gpa: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '', url: '' }]
    }));
  };

  const removeProject = (index: number) => {
    if (formData.projects.length > 1) {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index)
      }));
    }
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: '' }]
    }));
  };

  const removeLanguage = (index: number) => {
    if (formData.languages.length > 1) {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.filter((_, i) => i !== index)
      }));
    }
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', title: '', company: '', email: '', phone: '' }]
    }));
  };

  const removeReference = (index: number) => {
    if (formData.references.length > 1) {
      setFormData(prev => ({
        ...prev,
        references: prev.references.filter((_, i) => i !== index)
      }));
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    
    // During development, all templates are accessible for testing
    // In production, you would uncomment the tier check below:
    /*
    const allowedTemplates = getTemplatesByTier(userTier);
    
    if (!allowedTemplates.some(t => t.id === templateId)) {
      toast.error(`This template requires a higher tier subscription. Upgrade to access premium templates.`);
      return;
    }
    */
    
    setSelectedTemplate(templateId);
  };

  const generateCVText = (): string => {
    let cvText = `${formData.full_name}\n`;
    if (formData.job_title) cvText += `${formData.job_title}\n`;
    if (formData.email) cvText += `Email: ${formData.email}\n`;
    if (formData.phone) cvText += `Phone: ${formData.phone}\n`;
    if (formData.location) cvText += `Location: ${formData.location}\n`;
    if (formData.linkedin_url) cvText += `LinkedIn: ${formData.linkedin_url}\n`;
    if (formData.portfolio_url) cvText += `Portfolio: ${formData.portfolio_url}\n\n`;
    
    if (formData.summary) cvText += `PROFESSIONAL SUMMARY\n${formData.summary}\n\n`;
    
    if (formData.experiences && formData.experiences.length > 0) {
      cvText += `WORK EXPERIENCE\n`;
      formData.experiences.forEach(exp => {
        if (exp.company || exp.role) {
          cvText += `${exp.role || 'Position'} at ${exp.company || 'Company'} (${exp.duration || 'Duration'})\n`;
          if (exp.description) cvText += `${exp.description}\n`;
          cvText += `\n`;
        }
      });
    }
    
    if (formData.education && formData.education.length > 0) {
      cvText += `EDUCATION\n`;
      formData.education.forEach(edu => {
        if (edu.institution || edu.degree) {
          cvText += `${edu.degree || 'Degree'} - ${edu.institution || 'Institution'} (${edu.year || 'Year'})`;
          if (edu.gpa) cvText += ` - GPA: ${edu.gpa}`;
          cvText += `\n`;
        }
      });
      cvText += `\n`;
    }
    
    if (formData.projects && formData.projects.length > 0) {
      cvText += `PROJECTS\n`;
      formData.projects.forEach(proj => {
        if (proj.name || proj.description) {
          cvText += `${proj.name || 'Project'}\n`;
          if (proj.description) cvText += `${proj.description}\n`;
          if (proj.technologies) cvText += `Technologies: ${proj.technologies}\n`;
          if (proj.url) cvText += `URL: ${proj.url}\n`;
          cvText += `\n`;
        }
      });
    }
    
    if (formData.skills) cvText += `SKILLS\n${formData.skills}\n\n`;
    
    if (formData.languages && formData.languages.length > 0) {
      cvText += `LANGUAGES\n`;
      formData.languages.forEach(lang => {
        if (lang.language) {
          cvText += `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}\n`;
        }
      });
      cvText += `\n`;
    }
    
    if (formData.certifications) cvText += `CERTIFICATIONS\n${formData.certifications}\n\n`;
    
    if (formData.references && formData.references.length > 0) {
      cvText += `REFERENCES\n`;
      formData.references.forEach(ref => {
        if (ref.name) {
          cvText += `${ref.name}${ref.title ? ` - ${ref.title}` : ''}${ref.company ? ` at ${ref.company}` : ''}\n`;
          if (ref.email) cvText += `Email: ${ref.email}\n`;
          if (ref.phone) cvText += `Phone: ${ref.phone}\n`;
          cvText += `\n`;
        }
      });
    }
    
    return cvText.trim();
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return false;
    }
    
    if (formData.experiences.some(exp => exp.company && !exp.role)) {
      toast.error('Please provide job titles for all work experiences');
      return false;
    }

    if (formData.education.some(edu => edu.institution && !edu.degree)) {
      toast.error('Please provide degree information for all education entries');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const cvData = {
        ...formData,
        template_id: selectedTemplate,
        is_primary: false,
        ats_score: 0,
        content_type: 'manual'
      };

             let result;
       if (currentCVId) {
         result = await cvOperations.updateCV(currentCVId, cvData as Partial<CVData>);
       } else {
         result = await cvOperations.createCV(cvData as Omit<CVData, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
         setCurrentCVId(result.id);
       }

      toast.success(currentCVId ? 'CV updated successfully!' : 'CV created successfully!');
      setAnalysisComplete(false); // Reset analysis state after save
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Stepper navigation handlers
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goToStep = (idx: number) => setCurrentStep(idx);

  // Define no-op handlers
  const noop = () => {};
  const noopIndex = (_: number) => {};
  const noopField = (_: number, __: string, ___: string) => {};

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CVTemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            userTier={userTier}
          />
        );
      case 1:
        return <PersonalInfoStep formData={formData} onInputChange={handleInputChange} />;
      case 2:
        return <ExperienceStep formData={formData} onExperienceChange={handleExperienceChange} onAddExperience={addExperience} onRemoveExperience={removeExperience} />;
      case 3:
        return <EducationStep formData={formData} onEducationChange={handleEducationChange} onAddEducation={addEducation} onRemoveEducation={removeEducation} />;
      case 4:
        return <SkillsStep formData={formData} onInputChange={handleInputChange} onProjectChange={handleProjectChange} onAddProject={addProject} onRemoveProject={removeProject} onLanguageChange={handleLanguageChange} onAddLanguage={addLanguage} onRemoveLanguage={removeLanguage} />;
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Professional Summary</h3>
            <Textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Write a compelling summary of your professional experience and goals..."
              rows={6}
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">AI Suggestions & Improvements</h3>
            {userTier !== 'free' ? (
              <div className="p-4 bg-blue-50 rounded-lg text-blue-900">
                <h4 className="font-medium mb-2">AI-Powered Suggestions</h4>
                <p>AI suggestions and chat will appear here for eligible users.</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-gray-500">
                <h4 className="font-medium mb-2">Upgrade for AI Features</h4>
                <p>Upgrade to access AI suggestions and chat.</p>
              </div>
            )}
          </div>
        );
      case 7:
        return (
          <CVPreview
            cvData={{
              ...formData,
              id: currentCVId || '',
              user_id: user?.id || '',
              template_id: selectedTemplate,
              is_primary: false,
              ats_score: 0,
              content_type: 'manual',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as CVData}
            templateId={selectedTemplate}
            showPreview={true}
            onTogglePreview={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingCV ? 'Edit CV' : 'Create New CV'}
          </DialogTitle>
          <DialogDescription>
            Build a professional CV with our AI-powered tools and modern templates.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Progress */}
        <div className="flex items-center mb-6">
          {steps.map((step, idx) => (
            <React.Fragment key={step}>
              <button
                className={`flex-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${idx === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} ${idx < currentStep ? 'opacity-70' : ''}`}
                onClick={() => goToStep(idx)}
                disabled={idx > currentStep + 1}
              >
                {step}
              </button>
              {idx < steps.length - 1 && <span className="mx-1 text-gray-400">→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">{renderStepContent()}</div>

        {/* Stepper Navigation */}
        <div className="flex justify-between pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex space-x-2">
            <Button onClick={goBack} disabled={currentStep === 0} variant="ghost">
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {currentCVId ? 'Update CV' : 'Save CV'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 