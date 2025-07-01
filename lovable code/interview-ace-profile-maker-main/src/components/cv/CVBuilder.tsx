import React, { useState, useEffect } from 'react';
import { cvOperations, CVData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CVTemplateSelector } from './CVTemplateSelector';
import { CVPreview } from './CVPreview';
import { CVAnalysis } from './CVAnalysis';
import { Eye, EyeOff, Palette, Save, Download, Brain, CheckCircle, AlertCircle, Plus, X, Globe, Linkedin, Briefcase, Languages, Users } from 'lucide-react';
import { getTemplateById, getTemplatesByTier } from '@/data/cvTemplates';
import { useAuth } from '@/hooks/useAuth';

interface CVBuilderProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingCV?: CVData;
}

// Enhanced form data with all required fields
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

export const CVBuilder: React.FC<CVBuilderProps> = ({ onClose, onSuccess, editingCV }) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('basic-modern');
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
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

  useEffect(() => {
    checkAuth();
    getUserTier();
    if (editingCV) {
      setFormData({
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
      });
      if (editingCV.template_id) {
        setSelectedTemplate(editingCV.template_id);
      }
      setCurrentCVId(editingCV.id);
    }
  }, [editingCV]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    if (!user) {
      toast.error('Please sign in to create a CV');
      onClose();
    }
  };

  const getUserTier = async () => {
    // For now, default to free tier
    // TODO: Implement proper tier detection from user profile
    setUserTier('free');
  };

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
    // Check if user has access to this template
    const availableTemplates = getTemplatesByTier(userTier);
    const hasAccess = availableTemplates.some(template => template.id === templateId);
    
    if (hasAccess) {
      setSelectedTemplate(templateId);
      toast.success(`Template "${getTemplateById(templateId)?.name}" selected`);
    } else {
      toast.error('This template requires a higher subscription tier');
    }
  };

  const generateCVText = (): string => {
    let cvText = `${formData.full_name}\n`;
    if (formData.job_title) cvText += `Job Title: ${formData.job_title}\n`;
    if (formData.email) cvText += `Email: ${formData.email}\n`;
    if (formData.phone) cvText += `Phone: ${formData.phone}\n`;
    if (formData.location) cvText += `Location: ${formData.location}\n`;
    if (formData.linkedin_url) cvText += `LinkedIn: ${formData.linkedin_url}\n`;
    if (formData.portfolio_url) cvText += `Portfolio: ${formData.portfolio_url}\n\n`;
    
    if (formData.summary) cvText += `PROFESSIONAL SUMMARY\n${formData.summary}\n\n`;
    
    if (formData.experiences && formData.experiences.length > 0) {
      cvText += `WORK EXPERIENCE\n`;
      formData.experiences.forEach(exp => {
        cvText += `${exp.role} at ${exp.company} (${exp.duration})\n`;
        cvText += `${exp.description}\n\n`;
      });
    }
    
    if (formData.education && formData.education.length > 0) {
      cvText += `EDUCATION\n`;
      formData.education.forEach(edu => {
        cvText += `${edu.degree} - ${edu.institution} (${edu.year})`;
        if (edu.gpa) cvText += ` - GPA: ${edu.gpa}`;
        cvText += `\n`;
      });
      cvText += `\n`;
    }

    if (formData.projects && formData.projects.length > 0) {
      cvText += `PROJECTS\n`;
      formData.projects.forEach(proj => {
        cvText += `${proj.name}\n`;
        cvText += `Technologies: ${proj.technologies}\n`;
        cvText += `${proj.description}\n`;
        if (proj.url) cvText += `URL: ${proj.url}\n`;
        cvText += `\n`;
      });
    }
    
    if (formData.skills) cvText += `SKILLS\n${formData.skills}\n\n`;

    if (formData.languages && formData.languages.length > 0) {
      cvText += `LANGUAGES\n`;
      formData.languages.forEach(lang => {
        cvText += `${lang.language}: ${lang.proficiency}\n`;
      });
      cvText += `\n`;
    }
    
    if (formData.certifications) cvText += `CERTIFICATIONS\n${formData.certifications}\n\n`;

    if (formData.references && formData.references.length > 0) {
      cvText += `REFERENCES\n`;
      formData.references.forEach(ref => {
        cvText += `${ref.name} - ${ref.title} at ${ref.company}\n`;
        cvText += `Email: ${ref.email}\n`;
        if (ref.phone) cvText += `Phone: ${ref.phone}\n`;
        cvText += `\n`;
      });
    }
    
    return cvText.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to create a CV');
      onClose();
      return;
    }

    // Basic validation
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.summary.trim()) {
      toast.error('Professional summary is required');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const cvData = {
        user_id: user.id,
        full_name: formData.full_name,
        job_title: formData.job_title,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        summary: formData.summary,
        experiences: formData.experiences,
        education: formData.education,
        projects: formData.projects,
        skills: formData.skills,
        languages: formData.languages,
        certifications: formData.certifications,
        references: formData.references,
        template_id: selectedTemplate
      };

      if (editingCV) {
        const { data, error } = await supabase
          .from('cvs')
          .update(cvData)
          .eq('id', editingCV.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        setCurrentCVId(editingCV.id);
        toast.success('CV updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('cvs')
          .insert([cvData])
          .select()
          .single();

        if (error) throw error;
        setCurrentCVId(data.id);
        toast.success('CV created successfully!');
      }
      
      // Show analysis option after successful save
      setShowAnalysis(true);
      
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast.error(error.message || 'Failed to save CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  const handleExportPDF = () => {
    // Simple PDF export using browser print
    toast.info('Opening print dialog for PDF export...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to create or edit CVs.</p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {editingCV ? 'Edit CV' : 'Create New CV'}
              </h1>
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Template: {getTemplateById(selectedTemplate)?.name || selectedTemplate}</span>
              </div>
              {analysisComplete && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Analysis Complete</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {currentCVId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  {showAnalysis ? 'Hide Analysis' : 'Analyze CV'}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className={`grid gap-6 ${showPreview || showAnalysis ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Template Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Choose Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CVTemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  userTier={userTier}
                />
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="full_name"
                      placeholder="Full Name *"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="job_title"
                      placeholder="Job Title"
                      value={formData.job_title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="linkedin_url"
                      placeholder="LinkedIn URL"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Input
                    name="portfolio_url"
                    placeholder="Portfolio/Website URL"
                    value={formData.portfolio_url}
                    onChange={handleInputChange}
                  />
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="summary"
                    placeholder="Write a brief summary of your professional background, key achievements, and career objectives... *"
                    value={formData.summary}
                    onChange={handleInputChange}
                    required
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Work Experience</span>
                    <Button type="button" onClick={addExperience} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.experiences.map((exp, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Company *"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          required
                        />
                        <Input
                          placeholder="Role/Position *"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                          required
                        />
                      </div>
                      <Input
                        placeholder="Duration (e.g., Jan 2020 - Dec 2023) *"
                        value={exp.duration}
                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                        required
                      />
                      <Textarea
                        placeholder="Describe your responsibilities, achievements, and key contributions... *"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        required
                        rows={3}
                      />
                      {formData.experiences.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeExperience(index)}
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Education</span>
                    <Button type="button" onClick={addEducation} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Institution *"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          required
                        />
                        <Input
                          placeholder="Degree *"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Year *"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          required
                        />
                        <Input
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                        />
                      </div>
                      {formData.education.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Projects
                    </span>
                    <Button type="button" onClick={addProject} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.projects.map((proj, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                      <Input
                        placeholder="Project Name *"
                        value={proj.name}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Technologies Used"
                        value={proj.technologies}
                        onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                      />
                      <Input
                        placeholder="Project URL (optional)"
                        value={proj.url}
                        onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                      />
                      <Textarea
                        placeholder="Describe the project, your role, and key achievements..."
                        value={proj.description}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        rows={3}
                      />
                      {formData.projects.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProject(index)}
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="skills"
                    placeholder="List your technical skills, soft skills, and competencies (e.g., JavaScript, React, Project Management, Leadership)"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Languages
                    </span>
                    <Button type="button" onClick={addLanguage} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Language
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.languages.map((lang, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <Input
                        placeholder="Language"
                        value={lang.language}
                        onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                        className="flex-1"
                      />
                      <Select value={lang.proficiency} onValueChange={(value) => handleLanguageChange(index, 'proficiency', value)}>
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
                      {formData.languages.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeLanguage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="certifications"
                    placeholder="List your certifications, licenses, and professional qualifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* References */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      References
                    </span>
                    <Button type="button" onClick={addReference} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reference
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.references.map((ref, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Name *"
                          value={ref.name}
                          onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                          required
                        />
                        <Input
                          placeholder="Title *"
                          value={ref.title}
                          onChange={(e) => handleReferenceChange(index, 'title', e.target.value)}
                          required
                        />
                      </div>
                      <Input
                        placeholder="Company"
                        value={ref.company}
                        onChange={(e) => handleReferenceChange(index, 'company', e.target.value)}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Email *"
                          type="email"
                          value={ref.email}
                          onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                          required
                        />
                        <Input
                          placeholder="Phone"
                          value={ref.phone}
                          onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                        />
                      </div>
                      {formData.references.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeReference(index)}
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : (editingCV ? 'Update CV' : 'Create CV')}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview/Analysis Section */}
          {(showPreview || showAnalysis) && (
            <div className="lg:sticky lg:top-24">
              {showAnalysis && currentCVId ? (
                <CVAnalysis
                  cvId={currentCVId}
                  cvText={generateCVText()}
                  onAnalysisComplete={(analysis) => {
                    setAnalysisComplete(true);
                    toast.success(`Analysis complete! Your CV scored ${analysis.overallScore}/100`);
                  }}
                />
              ) : (
                <CVPreview
                  cvData={formData as any}
                  templateId={selectedTemplate}
                  showPreview={showPreview}
                  onTogglePreview={() => setShowPreview(false)}
                  onExportPDF={handleExportPDF}
                  onPrint={handlePrint}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
