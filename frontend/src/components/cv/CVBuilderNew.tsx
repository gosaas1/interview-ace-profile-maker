import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  FileText, 
  Edit, 
  Palette, 
  Eye, 
  Save, 
  Download,
  Plus,
  X,
  Check,
  Loader2,
  AlertCircle,
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
  Star,
  User
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CVTemplateSelector } from './CVTemplateSelector';
import { cvTemplates, getTemplateById } from '@/data/cvTemplates';

interface CVData {
  id?: string;
  user_id: string;
  title: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url?: string;
  website?: string;
  summary: string;
  skills: string[];
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    start_month?: string;
    start_year?: string;
    end_month?: string;
    end_year?: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    start_month?: string;
    start_year?: string;
    end_month?: string;
    end_year?: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  references: Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }>;
  template_id: string;
  created_at?: string;
  updated_at?: string;
}

interface CVBuilderNewProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingCV?: CVData;
}

const CV_BUILDER_STEPS = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Basic contact information' },
  { id: 2, title: 'Summary', icon: FileText, description: 'Professional summary' },
  { id: 3, title: 'Experience', icon: Briefcase, description: 'Work experience' },
  { id: 4, title: 'Education', icon: GraduationCap, description: 'Educational background' },
  { id: 5, title: 'Skills', icon: Star, description: 'Skills and competencies' },
  { id: 6, title: 'Projects', icon: Award, description: 'Projects and achievements' },
  { id: 7, title: 'Template', icon: Palette, description: 'Choose your template' },
  { id: 8, title: 'Preview', icon: Eye, description: 'Review and save' }
];

// Helper arrays for months and years
const months: string[] = [
  '', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years: string[] = Array.from({ length: 50 }, (_, i) => (currentYear + 5 - i).toString());

const CVBuilderNew: React.FC<CVBuilderNewProps> = ({ onClose, onSuccess, editingCV }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('ats-optimized-classic');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [lastSavedCVName, setLastSavedCVName] = useState('');

  // CV Data state
  const [cvData, setCVData] = useState<CVData>({
    user_id: user?.id || '',
    title: editingCV?.title || 'My Professional CV',
    full_name: editingCV?.full_name || '',
    email: editingCV?.email || '',
    phone: editingCV?.phone || '',
    location: editingCV?.location || '',
    linkedin_url: editingCV?.linkedin_url || '',
    website: editingCV?.website || '',
    summary: editingCV?.summary || '',
    skills: editingCV?.skills || [],
    experience: editingCV?.experience || [],
    education: editingCV?.education || [],
    certifications: editingCV?.certifications || [],
    languages: editingCV?.languages || [],
    projects: editingCV?.projects || [],
    references: editingCV?.references || [],
    template_id: editingCV?.template_id || 'ats-optimized-classic'
  });

  // Initialize with editing data
  useEffect(() => {
    if (editingCV) {
      setCVData(editingCV);
      setSelectedTemplate(editingCV.template_id);
    }
  }, [editingCV]);

  const updateCVData = (field: keyof CVData, value: any) => {
    setCVData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      start_month: '',
      start_year: '',
      end_month: '',
      end_year: '',
      current: false,
      description: ''
    };
    updateCVData('experience', [...cvData.experience, newExperience]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    updateCVData('experience', cvData.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    updateCVData('experience', cvData.experience.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      start_month: '',
      start_year: '',
      end_month: '',
      end_year: '',
      current: false,
      gpa: '',
      description: ''
    };
    updateCVData('education', [...cvData.education, newEducation]);
  };

  const updateEducation = (id: string, field: string, value: any) => {
    updateCVData('education', cvData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    updateCVData('education', cvData.education.filter(edu => edu.id !== id));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: ''
    };
    updateCVData('projects', [...cvData.projects, newProject]);
  };

  const updateProject = (id: string, field: string, value: any) => {
    updateCVData('projects', cvData.projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const removeProject = (id: string) => {
    updateCVData('projects', cvData.projects.filter(proj => proj.id !== id));
  };

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
    updateCVData('skills', skillsArray);
  };

  const nextStep = () => {
    if (currentStep < CV_BUILDER_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveCV = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your CV",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting save process...');
      console.log('User ID:', user.id);
      console.log('CV Data:', cvData);
      console.log('Selected Template:', selectedTemplate);

      // Convert skills array to string for database storage
      const skillsString = Array.isArray(cvData.skills) 
        ? cvData.skills.join(', ')
        : cvData.skills || '';

      const cvToSave = {
        user_id: user.id,
        full_name: cvData.full_name,
        email: cvData.email,
        phone: cvData.phone,
        location: cvData.location,
        summary: cvData.summary,
        experiences: cvData.experience,
        education: cvData.education,
        skills: skillsString, // Store as string, not array
        certifications: cvData.certifications,
        template_id: selectedTemplate,
        updated_at: new Date().toISOString()
      };

      console.log('CV to save:', cvToSave);

      let result;
      if (cvData.id) {
        // Update existing CV
        console.log('Updating existing CV with ID:', cvData.id);
        result = await supabase
          .from('cvs')
          .update(cvToSave)
          .eq('id', cvData.id)
          .select();
      } else {
        // Create new CV
        console.log('Creating new CV');
        result = await supabase
          .from('cvs')
          .insert([cvToSave])
          .select();
      }

      console.log('Supabase result:', result);

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      // Get the CV id (for new or updated CV)
      const savedCV = result.data && result.data[0] ? result.data[0] : cvData;
      console.log('CV saved successfully:', savedCV);
      setLastSavedCVName(savedCV.full_name || 'Untitled CV');
      setShowSaveModal(true);
      console.log('Save modal should be visible now');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      toast({
        title: "Error saving CV",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {CV_BUILDER_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'bg-background border-muted-foreground text-muted-foreground'
            }`}>
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            {index < CV_BUILDER_STEPS.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Personal Information</h3>
        <p className="text-muted-foreground">Let's start with your basic contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">CV Title</Label>
            <Input
              id="title"
              value={cvData.title}
              onChange={(e) => updateCVData('title', e.target.value)}
              placeholder="e.g., Software Engineer CV"
            />
          </div>

          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={cvData.full_name}
              onChange={(e) => updateCVData('full_name', e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={cvData.email}
              onChange={(e) => updateCVData('email', e.target.value)}
              placeholder="john.doe@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={cvData.phone}
              onChange={(e) => updateCVData('phone', e.target.value)}
              placeholder="+44 123 456 7890"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={cvData.location}
              onChange={(e) => updateCVData('location', e.target.value)}
              placeholder="London, UK"
            />
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={cvData.linkedin_url}
              onChange={(e) => updateCVData('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>

          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={cvData.website}
              onChange={(e) => updateCVData('website', e.target.value)}
              placeholder="https://johndoe.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Professional Summary</h3>
        <p className="text-muted-foreground">Write a compelling summary of your professional background</p>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={cvData.summary}
          onChange={(e) => updateCVData('summary', e.target.value)}
          placeholder="Experienced software engineer with 5+ years developing scalable web applications..."
          rows={6}
          className="resize-none"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Aim for 3-4 sentences that highlight your key strengths and career objectives
        </p>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Work Experience</h3>
        <p className="text-muted-foreground">Add your professional work experience</p>
      </div>

      <div className="space-y-6">
        {cvData.experience.map((exp, index) => (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Tech Company Ltd"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    placeholder="London, UK"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Date</Label>
                    <select value={exp.start_month || ''} onChange={e => updateExperience(exp.id, 'start_month', e.target.value)}>
                      {months.map((m: string) => <option key={m} value={m}>{m || 'Month'}</option>)}
                    </select>
                    <select value={exp.start_year || ''} onChange={e => updateExperience(exp.id, 'start_year', e.target.value)}>
                      <option value=''>Year</option>
                      {years.map((y: string) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <select value={exp.end_month || ''} onChange={e => updateExperience(exp.id, 'end_month', e.target.value)}>
                      {months.map((m: string) => <option key={m} value={m}>{m || 'Month'}</option>)}
                    </select>
                    <select value={exp.end_year || ''} onChange={e => updateExperience(exp.id, 'end_year', e.target.value)}>
                      <option value=''>Year</option>
                      {years.map((y: string) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                />
                <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addExperience} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Education</h3>
        <p className="text-muted-foreground">Add your educational background</p>
      </div>

      <div className="space-y-6">
        {cvData.education.map((edu, index) => (
          <Card key={edu.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Education {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University of London"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    placeholder="London, UK"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Date</Label>
                    <select value={edu.start_month || ''} onChange={e => updateEducation(edu.id, 'start_month', e.target.value)}>
                      {months.map((m: string) => <option key={m} value={m}>{m || 'Month'}</option>)}
                    </select>
                    <select value={edu.start_year || ''} onChange={e => updateEducation(edu.id, 'start_year', e.target.value)}>
                      <option value=''>Year</option>
                      {years.map((y: string) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <select value={edu.end_month || ''} onChange={e => updateEducation(edu.id, 'end_month', e.target.value)}>
                      {months.map((m: string) => <option key={m} value={m}>{m || 'Month'}</option>)}
                    </select>
                    <select value={edu.end_year || ''} onChange={e => updateEducation(edu.id, 'end_year', e.target.value)}>
                      <option value=''>Year</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-edu-${edu.id}`}
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                />
                <Label htmlFor={`current-edu-${edu.id}`}>I'm currently studying here</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    placeholder="Relevant coursework, honors, activities..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addEducation} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Skills & Competencies</h3>
        <p className="text-muted-foreground">List your key skills and competencies</p>
      </div>

      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Textarea
          id="skills"
          value={cvData.skills.join(', ')}
          onChange={(e) => handleSkillsChange(e.target.value)}
          placeholder="JavaScript, React, Node.js, Python, SQL, AWS..."
          rows={4}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Separate skills with commas. Include technical skills, soft skills, and tools you're proficient with.
        </p>
      </div>

      {cvData.skills.length > 0 && (
        <div>
          <Label>Skills Preview</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {cvData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Projects & Achievements</h3>
        <p className="text-muted-foreground">Showcase your key projects and achievements</p>
      </div>

      <div className="space-y-6">
        {cvData.projects.map((proj, index) => (
          <Card key={proj.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Project {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(proj.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div>
                  <Label>Project URL (Optional)</Label>
                  <Input
                    value={proj.url}
                    onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                    placeholder="https://project-demo.com"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                  placeholder="Describe the project, your role, and key achievements..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Technologies Used (comma-separated)</Label>
                <Input
                  value={proj.technologies.join(', ')}
                  onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                  placeholder="React, Node.js, MongoDB, AWS"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addProject} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Choose Your Template</h3>
        <p className="text-muted-foreground">Select a template that best represents your professional style</p>
      </div>

      <CVTemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateSelect={(templateId) => setSelectedTemplate(templateId)}
      />
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Preview Your CV</h3>
        <p className="text-muted-foreground">Review your CV before saving</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>CV Preview</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-white">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{cvData.full_name || 'Your Name'}</h1>
              <p className="text-muted-foreground">{cvData.title || 'Professional Title'}</p>
              <div className="flex items-center justify-center space-x-4 mt-2 text-sm">
                {cvData.email && <span>{cvData.email}</span>}
                {cvData.phone && <span>{cvData.phone}</span>}
                {cvData.location && <span>{cvData.location}</span>}
              </div>
            </div>

            {cvData.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Professional Summary</h2>
                <p className="text-sm">{cvData.summary}</p>
              </div>
            )}

            {cvData.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Work Experience</h2>
                {cvData.experience.map((exp, index) => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {exp.start_month ? exp.start_month + ' ' : ''}{exp.start_year} - {exp.current ? 'Present' : (exp.end_month ? exp.end_month + ' ' : '') + exp.end_year}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {cvData.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderSummary();
      case 3: return renderExperience();
      case 4: return renderEducation();
      case 5: return renderSkills();
      case 6: return renderProjects();
      case 7: return renderTemplateSelection();
      case 8: return renderPreview();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStepIndicator()}
      
      <div className="mb-8">
        {renderCurrentStep()}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentStep === CV_BUILDER_STEPS.length ? (
            <Button onClick={saveCV} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save CV
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">CV Saved!</h2>
            <p className="mb-4">Your CV '{lastSavedCVName}' has been saved successfully.</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => { setShowSaveModal(false); navigate('/cvs'); }}>View All My CVs</Button>
              <Button variant="outline" onClick={() => { setShowSaveModal(false); /* trigger PDF download logic here */ }}>Download PDF</Button>
              <Button variant="ghost" onClick={() => setShowSaveModal(false)}>Continue Editing</Button>
              <Button variant="secondary" onClick={() => { setShowSaveModal(false); /* logic to start new CV */ }}>Create New CV</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilderNew; 