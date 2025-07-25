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

interface CVBuilderProps {
  // Add any props if needed
}

export default function CVBuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get initial data from upload flow or use defaults
  const uploadData = location.state?.initialData;
  const fromUpload = location.state?.fromUpload;
  const initialTemplate = location.state?.selectedTemplate || 'basic-modern';

  // 1. Ensure selectedTemplate state exists
  const [selectedTemplate, setSelectedTemplate] = useState<string>("basic-modern");
  // 2. Add handleTemplateSelect function
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false); // Close modal and show live preview
    // Always load sample data for preview unless the user has started editing their own data
    const isEmpty = !cvData || !cvData.personalInfo?.fullName;
    if (isEmpty) {
      const sampleData = getSampleDataForTemplate(templateId);
      setCvData(sampleData);
    }
  };
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

  // Rich test data for preview
  const testCVData: CVData = {
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+44 1234 567890",
      location: "London, UK",
      linkedIn: "https://linkedin.com/in/janedoe",
      website: "https://janedoe.dev",
      summary: "Senior Software Engineer with 8+ years of experience building scalable web applications, leading cross-functional teams, and delivering robust, maintainable code. Adept at collaborating with stakeholders, mentoring junior engineers, and driving projects from concept to deployment. Passionate about clean architecture, continuous learning, and leveraging technology to solve real-world problems."
    },
    experience: [
      {
        id: "exp1",
        company: "FinTech Solutions",
        position: "Lead Engineer",
        location: "London, UK",
        startDate: "2019-03",
        endDate: "2024-01",
        current: false,
        description: "Led a team of 10 engineers to deliver a high-availability payments platform, collaborating with product managers and designers to define requirements and ensure timely delivery. Implemented CI/CD pipelines, improved system reliability by 30%, and mentored junior developers in best practices."
      },
      {
        id: "exp2",
        company: "EduTech Ltd",
        position: "Full Stack Developer",
        location: "Remote",
        startDate: "2016-06",
        endDate: "2019-02",
        current: false,
        description: "Developed and maintained e-learning platforms using React, Node.js, and PostgreSQL. Worked closely with educators to design interactive features, optimized database queries for performance, and contributed to open-source education tools."
      },
      {
        id: "exp3",
        company: "Global Health Corp",
        position: "Software Engineer",
        location: "Manchester, UK",
        startDate: "2014-01",
        endDate: "2016-05",
        current: false,
        description: "Built scalable REST APIs for healthcare data integration, implemented authentication and authorization, and collaborated with cross-functional teams to deliver secure, user-friendly applications."
      }
    ],
    education: [
      {
        id: "edu1",
        institution: "University of Oxford",
        degree: "MSc Computer Science",
        field: "Computer Science",
        startDate: "2014-09",
        endDate: "2016-06",
        gpa: "4.0"
      },
      {
        id: "edu2",
        institution: "Imperial College London",
        degree: "BEng Software Engineering",
        field: "Software Engineering",
        startDate: "2011-09",
        endDate: "2014-06",
        gpa: "3.9"
      }
    ],
    skills: [
      "TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Docker", "CI/CD", "Agile", "Leadership", "GraphQL", "Microservices", "Jest", "Tailwind CSS", "Mentoring", "REST APIs"
    ],
    certifications: [
      {
        id: "cert1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-04"
      },
      {
        id: "cert2",
        name: "Scrum Master",
        issuer: "Scrum Alliance",
        date: "2021-09"
      },
      {
        id: "cert3",
        name: "Google Cloud Professional Engineer",
        issuer: "Google Cloud",
        date: "2022-07"
      }
    ],
    projects: [
      {
        id: "proj1",
        name: "Open Source Job Board",
        description: "Created a job board platform for remote tech jobs, used by 10,000+ users. Designed the architecture, implemented advanced search, and integrated third-party APIs.",
        technologies: "React, Node.js, MongoDB",
        url: "https://github.com/janedoe/job-board"
      },
      {
        id: "proj2",
        name: "Personal Portfolio",
        description: "Designed and built a personal portfolio website with blog and project showcase. Implemented SEO best practices and analytics integration.",
        technologies: "Next.js, Tailwind CSS",
        url: "https://janedoe.dev"
      }
    ],
    languages: [
      {
        id: "lang1",
        language: "English",
        proficiency: "Native"
      },
      {
        id: "lang2",
        language: "French",
        proficiency: "Professional"
      },
      {
        id: "lang3",
        language: "Spanish",
        proficiency: "Conversational"
      }
    ],
    references: [
      {
        id: "ref1",
        name: "Dr. Alan Turing",
        title: "CTO",
        company: "FinTech Solutions",
        email: "alan.turing@fintech.com",
        phone: "+44 9876 543210"
      },
      {
        id: "ref2",
        name: "Grace Hopper",
        title: "Engineering Manager",
        company: "EduTech Ltd",
        email: "grace.hopper@edutech.com",
        phone: "+44 1234 567891"
      },
      {
        id: "ref3",
        name: "Ada Lovelace",
        title: "Lead Architect",
        company: "Global Health Corp",
        email: "ada.lovelace@ghc.com",
        phone: "+44 5555 123456"
      }
    ]
  };

  // Fallback dummy cvData for development/testing
  useEffect(() => {
    if (!cvData || Object.keys(cvData).length === 0) {
      setCvData(testCVData);
    }
  }, []);

  // Always load test data for preview unless the user has started editing their own data
  useEffect(() => {
    const isEmpty = !cvData || !cvData.personalInfo?.fullName;
    if (isEmpty) {
      setCvData(testCVData);
    }
  }, [selectedTemplate]);

  // Load test data when toggle is switched
  useEffect(() => {
    if (useSampleData) {
      setCvData(testCVData);
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
  // Remove auto-save useEffect and autoSaveCV function

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
    // Safety check: prevent saving if cvData is empty or malformed
    if (!cvData || typeof cvData !== 'object' || Object.keys(cvData).length === 0) {
      console.error('Malformed or empty cvData:', cvData);
      toast.error('CV data is empty or invalid. Please fill out your CV.');
      return;
    }
    setIsSaving(true);
    try {
      const saveBody = {
        title: cvData?.personalInfo?.fullName || 'Untitled CV',
        content: cvData,
        template_id: selectedTemplate ?? 'basic-modern',
        is_public: false
      };
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
        body: JSON.stringify(saveBody)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save failed:', errorText);
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

  // Add a test populate button for development/testing
  const handleTestPopulate = () => {
    setCvData(testCVData);
    toast.success('Test data populated! You can now save and preview the full CV.');
  };

  // JWT-authenticated analytics call example
  const fetchAnalytics = async () => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    const response = await fetch('/api/analytics/usage', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    // handle response as needed
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

              {process.env.NODE_ENV !== 'production' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestPopulate}
                  className="flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Test Populate</span>
                </Button>
              )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: CV Builder Form */}
            <div className="flex flex-col">
              {/* Sample Data Notice */}
              {useSampleData && (
                <Card className="border-blue-200 bg-blue-50 mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Sample Data Mode</h4>
                        <p className="text-sm text-blue-800">
                          You're viewing sample data to see how your CV will look. 
                          Toggle off to start building your own CV!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Template Selector UI */}
              <div className="flex gap-2 my-4">
                {['basic-modern', 'modern-professional', 'classic-elegant'].map((templateId) => (
                  <button
                    key={templateId}
                    onClick={() => handleTemplateSelect(templateId)}
                    className={`px-3 py-2 rounded border ${selectedTemplate === templateId ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  >
                    {templateId.replace('-', ' ')}
                  </button>
                ))}
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-3 py-2 rounded border bg-gray-100 text-blue-700 hover:bg-blue-50 ml-2"
                >
                  Back to Template Selector
                </button>
              </div>

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
                      ? 'View sample data to see how your CV will look with this template'
                      : 'Fill in your information to create a professional CV'
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
                <Card className="mt-4">
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
            {/* Right: CV Preview */}
            <div className="flex flex-col items-stretch justify-start w-full">
              <CVPreview cvData={cvData} template={selectedTemplate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 