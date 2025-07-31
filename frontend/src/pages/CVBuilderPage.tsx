import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Download, Eye, Palette, Check, Loader2, Database, Mail, Phone, Zap, Printer } from 'lucide-react';
import CVTemplateSelector from '@/components/cv/CVTemplateSelector';
import CVForm from '@/components/cv-builder/CVForm';
import CVPreview from '@/components/cv/CVPreview';
import { cvTemplates, getTemplateById } from '@/data/cvTemplates';
import { getSampleDataForTemplate } from '@/data/sampleCVData';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { CVData } from '@/lib/cv/types';
import { supabase, cvOperations } from '@/lib/supabase';
import { normalizeCVData } from '@/lib/cv/normalize';
import { printCV } from '@/lib/cv/print';

interface CVBuilderProps {
  // Add any props if needed
}

export default function CVBuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cvId } = useParams<{ cvId: string }>();
  
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
      setCvData(testCVData);
    }
  };
  const [showTemplateSelector, setShowTemplateSelector] = useState(!fromUpload);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showCVNameModal, setShowCVNameModal] = useState(false);
  const [cvNameInput, setCvNameInput] = useState('My CV');
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [useSampleData, setUseSampleData] = useState(false);
  const [isLoadingCV, setIsLoadingCV] = useState(false);
  const [hasLoadedCV, setHasLoadedCV] = useState(false);
  
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: []
  });

  // Rich test data for preview
  const testCVData: CVData = {
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+44 1234 567890",
      location: "London, UK",
      linkedin: "https://linkedin.com/in/janedoe",
      website: "https://janedoe.dev",
      summary: "Senior Software Engineer with 8+ years of experience building scalable web applications, leading cross-functional teams, and delivering robust, maintainable code. Adept at collaborating with stakeholders, mentoring junior engineers, and driving projects from concept to deployment. Passionate about clean architecture, continuous learning, and leveraging technology to solve real-world problems."
    },
    experiences: [
      {
        id: "exp1",
        company: "FinTech Solutions",
        position: "Lead Engineer",
        location: "London, UK",
        startDate: "2019-03",
        endDate: "2024-01",
        description: "Led a team of 10 engineers to deliver a high-availability payments platform, collaborating with product managers and designers to define requirements and ensure timely delivery. Implemented CI/CD pipelines, improved system reliability by 30%, and mentored junior developers in best practices."
      },
      {
        id: "exp2",
        company: "EduTech Ltd",
        position: "Full Stack Developer",
        location: "Remote",
        startDate: "2016-06",
        endDate: "2019-02",
        description: "Developed and maintained e-learning platforms using React, Node.js, and PostgreSQL. Worked closely with educators to design interactive features, optimized database queries for performance, and contributed to open-source education tools."
      },
      {
        id: "exp3",
        company: "Global Health Corp",
        position: "Software Engineer",
        location: "Manchester, UK",
        startDate: "2014-01",
        endDate: "2016-05",
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
      { id: "skill1", name: "TypeScript" },
      { id: "skill2", name: "React" },
      { id: "skill3", name: "Node.js" },
      { id: "skill4", name: "PostgreSQL" },
      { id: "skill5", name: "AWS" },
      { id: "skill6", name: "Docker" },
      { id: "skill7", name: "CI/CD" },
      { id: "skill8", name: "Agile" },
      { id: "skill9", name: "Leadership" },
      { id: "skill10", name: "GraphQL" },
      { id: "skill11", name: "Microservices" },
      { id: "skill12", name: "Jest" },
      { id: "skill13", name: "Tailwind CSS" },
      { id: "skill14", name: "Mentoring" },
      { id: "skill15", name: "REST APIs" }
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
        technologies: ["React", "Node.js", "MongoDB"],
        link: "https://github.com/janedoe/job-board"
      },
      {
        id: "proj2",
        name: "Personal Portfolio",
        description: "Designed and built a personal portfolio website with blog and project showcase. Implemented SEO best practices and analytics integration.",
        technologies: ["Next.js", "Tailwind CSS"],
        link: "https://janedoe.dev"
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

  // Load initial test data when component mounts - REMOVED to prevent interference with save process
  // useEffect(() => {
  //   // Only load test data if we're not loading a specific CV by ID and no CV has been loaded
  //   if (!cvId && !hasLoadedCV) {
  //     setCvData(testCVData);
  //   }
  // }, []); // Empty dependency array - only run once on mount

  // Load CV from database if cvId is provided
  useEffect(() => {
    if (cvId && user) {
      loadCVFromId(cvId);
    }
  }, [cvId, user]);

  const loadCVFromId = async (id: string) => {
    setIsLoadingCV(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/cv/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load CV');
      }

      const cvData = await response.json();
      console.log('Raw CV data from API:', cvData);
      
      // UNIFIED LOGIC: Always normalize loaded data before setting state
      let normalizedData: CVData;
      
      // The backend sends data in the content field of the response
      // Use the content field from the API response
      normalizedData = normalizeCVData(cvData.content || cvData);

      console.log('Normalized CV data:', normalizedData);
      console.log('Personal info in normalized data:', normalizedData.personalInfo);
      console.log('Experiences count:', normalizedData.experiences?.length);
      console.log('Education count:', normalizedData.education?.length);
      console.log('Skills count:', normalizedData.skills?.length);

      // Set the normalized data
      setCvData(normalizedData);
      setHasLoadedCV(true); // Mark that a CV has been loaded
      
      console.log('CV data state updated with loaded CV:', normalizedData);
      
      // Set template if available
      if (cvData.template_id) {
        setSelectedTemplate(cvData.template_id);
      }
      
      toast.success('CV loaded successfully!');
    } catch (error) {
      console.error('Failed to load CV:', error);
      toast.error('Failed to load CV. Please try again.');
    } finally {
      setIsLoadingCV(false);
    }
  };

  // Load test data when toggle is switched - REMOVED to prevent data reset
  // useEffect(() => {
  //   if (useSampleData) {
  //     setCvData(testCVData);
  //     toast.success('Sample data loaded! You can now see the live preview.');
  //   } else {
  //     // Reset to empty data
  //     setCvData({
  //       personalInfo: {
  //         fullName: '',
  //         email: '',
  //         phone: '',
  //         location: '',
  //         linkedin: '',
  //         website: '',
  //         summary: ''
  //       },
  //       experiences: [],
  //       education: [],
  //       skills: [],
  //       certifications: [],
  //       languages: [],
  //       projects: []
  //     });
  //     toast.info('Sample data disabled. Start building your own CV!');
  //   }
  // }, [useSampleData]);

  // Auto-save functionality
  // Remove auto-save useEffect and autoSaveCV function

  // Create CV function that works with our new format
  const createCV = async (cvData: any) => {
    try {
      console.log('🟡 Creating CV via backend API with data:', cvData);
      
      // Get the current session token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('🟡 No valid session token found');
        return { success: false, error: 'Authentication required' };
      }
      
      // Use the backend API instead of direct Supabase calls
      const response = await fetch('/api/cv/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(cvData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('🟡 Backend API error:', result);
        return { success: false, error: result.error || 'Failed to create CV' };
      }

      console.log('🟡 CV created successfully via backend:', result);
      return { success: true, data: result, error: null };
    } catch (error: any) {
      console.error('🟡 CV creation error:', error);
      return { success: false, error: error.message };
    }
  };

  // Save CV - Unified Logic
  const handleSaveCV = async () => {
    console.log('🟡 handleSaveCV called');
    if (!user) {
      toast.error('Please log in to save your CV');
      return;
    }
    
    console.log('🟡 User authenticated, proceeding with save');
    console.log('Current cvData before normalization:', cvData);
    
    // UNIFIED LOGIC: Always normalize cvData before save
    const normalizedCV = normalizeCVData(cvData);
    
    console.log('Normalized CV data:', normalizedCV);
    
    // Safety check: prevent saving if cvData is empty or malformed
    if (!normalizedCV || typeof normalizedCV !== 'object' || Object.keys(normalizedCV).length === 0) {
      console.error('Malformed or empty cvData:', normalizedCV);
      toast.error('CV data is empty or invalid. Please fill out your CV.');
      return;
    }
    
    // Check if we have meaningful data to save (not just empty fields)
    const hasPersonalInfo = normalizedCV.personalInfo?.fullName || normalizedCV.personalInfo?.email || normalizedCV.personalInfo?.summary;
    const hasExperiences = normalizedCV.experiences && normalizedCV.experiences.length > 0;
    const hasEducation = normalizedCV.education && normalizedCV.education.length > 0;
    const hasSkills = normalizedCV.skills && normalizedCV.skills.length > 0;
    
    console.log('Data validation:', { hasPersonalInfo, hasExperiences, hasEducation, hasSkills });
    
    if (!hasPersonalInfo && !hasExperiences && !hasEducation && !hasSkills) {
      toast.error('Please add some content to your CV before saving. Click "Test Populate" to load sample data.');
      return;
    }
    
    // Store the save data and show custom modal
    setPendingSaveData(normalizedCV);
    setCvNameInput('My CV');
    setShowCVNameModal(true);
  };

  // Handle the actual save process
  const handleConfirmSave = async () => {
    if (!pendingSaveData || !cvNameInput.trim()) {
      toast.error('CV name is required');
      return;
    }

    setIsSaving(true);
    setShowCVNameModal(false);
    
    try {
      console.log('Saving CV with data:', pendingSaveData);
      console.log('CV name to save:', cvNameInput);
      console.log('Template ID:', selectedTemplate);
      
      // Simplified backend format - just send the normalized CV data
      const backendFormat = {
        title: cvNameInput.trim(), // Backend expects 'title', not 'cv_filename'
        content: pendingSaveData, // full JSON CV
        template_id: selectedTemplate ?? 'basic-modern',
        is_public: false
      };
      
      console.log("🟡 Normalized CV Data:", pendingSaveData);
      console.log("🟡 Backend Format:", backendFormat);
      
      const saveBody = backendFormat;
      console.log('Save body:', saveBody);
      
      // Call createCV function and log the result
      const { success, error } = await createCV(saveBody);
      console.log("🟢 Save Result:", { success, error });
      
      if (success) {
        console.log("✅ CV saved successfully, data:", success);
        setLastSaved(new Date());
        toast.success('CV saved successfully!');
        
        // Navigate to CVs section with multiple fallback options
        console.log("✅ Save succeeded, redirecting to /cvs");
        console.log("🟢 About to call navigate('/cvs')");
        
        // Try multiple redirect methods
        try {
          navigate("/cvs");
          console.log("🟢 navigate('/cvs') called successfully");
        } catch (navError) {
          console.error("🟡 Navigation error:", navError);
          // Fallback 1: Try window.location
          try {
            window.location.href = "/cvs";
            console.log("🟢 window.location.href redirect executed");
          } catch (windowError) {
            console.error("🟡 Window location error:", windowError);
            // Fallback 2: Try setTimeout with navigate
            setTimeout(() => {
              try {
                navigate("/cvs");
                console.log("🟢 setTimeout navigate('/cvs') executed");
              } catch (timeoutError) {
                console.error("🟡 Timeout navigation error:", timeoutError);
                // Final fallback: Show message and manual redirect
                toast.info('CV saved! Please go to CVs page to view your saved CV.');
              }
            }, 100);
          }
        }
      } else {
        console.error('Save failed:', error);
        toast.error('Failed to save CV. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save CV. Please try again.');
    } finally {
      setIsSaving(false);
      setPendingSaveData(null);
    }
  };

  // Download CV - Unified Logic
  const handleDownloadCV = async () => {
    if (!cvData) {
      toast.error('No CV data to download');
      return;
    }
    const normalizedCV = normalizeCVData(cvData);
    try {
      await printCV({
        cvData: normalizedCV,
        template: selectedTemplate,
        userTier: 'free', // TODO: Get actual user tier
        mode: 'download'
      });
      toast.success('CV downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download CV. Please try again.');
    }
  };

  // Print CV - Unified Logic
  const handlePrintCV = async () => {
    if (!cvData) {
      toast.error('No CV data to print');
      return;
    }
    const normalizedCV = normalizeCVData(cvData);
    try {
      await printCV({
        cvData: normalizedCV,
        template: selectedTemplate,
        userTier: 'free', // TODO: Get actual user tier
        mode: 'print'
      });
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print CV. Please try again.');
    }
  };

  // Add a test populate button for development/testing
  const handleTestPopulate = () => {
    console.log('Test populate triggered');
    console.log('🔍 DEBUG: Current cvData before test populate:', cvData);
    const testData: CVData = {
      personalInfo: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+44 1234 567890',
        location: 'London, UK',
        linkedin: 'https://linkedin.com/in/janedoe',
        website: 'https://janedoe.dev',
        summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and mentoring junior developers.'
      },
      experiences: [
        {
          id: 'exp1',
          company: 'TechCorp Ltd',
          position: 'Senior Software Engineer',
          location: 'London, UK',
          startDate: '2022-01',
          endDate: '2024-12',
          description: 'Led development of microservices architecture, improved system performance by 40%, and mentored 3 junior developers.'
        },
        {
          id: 'exp2',
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          location: 'Remote',
          startDate: '2020-03',
          endDate: '2021-12',
          description: 'Built and deployed 5 web applications using React, Node.js, and AWS. Implemented CI/CD pipelines and automated testing.'
        }
      ],
      education: [
        {
          id: 'edu1',
          institution: 'University of Oxford',
          degree: 'MSc Computer Science',
          field: 'Computer Science',
          startDate: '2018-09',
          endDate: '2019-06',
          gpa: '4.0'
        },
        {
          id: 'edu2',
          institution: 'Imperial College London',
          degree: 'BEng Software Engineering',
          field: 'Software Engineering',
          startDate: '2015-09',
          endDate: '2018-06',
          gpa: '3.9'
        }
      ],
      skills: [
        { id: 'skill1', name: 'JavaScript', level: 'Advanced' },
        { id: 'skill2', name: 'TypeScript', level: 'Advanced' },
        { id: 'skill3', name: 'React', level: 'Advanced' },
        { id: 'skill4', name: 'Node.js', level: 'Advanced' },
        { id: 'skill5', name: 'Python', level: 'Intermediate' },
        { id: 'skill6', name: 'AWS', level: 'Intermediate' },
        { id: 'skill7', name: 'Docker', level: 'Intermediate' },
        { id: 'skill8', name: 'Kubernetes', level: 'Beginner' }
      ],
      certifications: [
        {
          id: 'cert1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023-04'
        },
        {
          id: 'cert2',
          name: 'Scrum Master',
          issuer: 'Scrum Alliance',
          date: '2021-09'
        }
      ],
      languages: [
        {
          id: 'lang1',
          language: 'English',
          proficiency: 'Native'
        },
        {
          id: 'lang2',
          language: 'French',
          proficiency: 'Professional'
        }
      ],
      projects: [
        {
          id: 'proj1',
          name: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented payment processing, inventory management, and admin dashboard.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          link: 'https://github.com/janedoe/ecommerce',
          date: '2023'
        }
      ],
      references: [
        {
          id: 'ref1',
          name: 'Dr. Alan Turing',
          title: 'CTO',
          company: 'FinTech Solutions',
          email: 'alan.turing@fintech.com',
          phone: '+44 9876 543210'
        },
        {
          id: 'ref2',
          name: 'Grace Hopper',
          title: 'Engineering Manager',
          company: 'EduTech Ltd',
          email: 'grace.hopper@edutech.com',
          phone: '+44 1234 567891'
        }
      ]
    };
    
    console.log('Setting test data:', testData);
    setCvData(testData);
    toast.success('Comprehensive test data loaded! This CV includes all personal info fields, mixed skill formats, and complete sections for testing save, preview, print, and download.');
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
                onClick={handlePrintCV}
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
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

              {/* Test navigation button */}
              <Button
                onClick={() => {
                  console.log("🟡 Test navigation button clicked");
                  try {
                    navigate("/cvs");
                    console.log("🟢 Test navigation successful");
                  } catch (error) {
                    console.error("🟡 Test navigation failed:", error);
                  }
                }}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <span>Test Navigate to CVs</span>
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
      
      {/* Custom CV Name Modal */}
      {showCVNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">ApplyAce says</h3>
            <p className="text-gray-600 mb-4">Enter a name for your CV:</p>
            <input
              type="text"
              value={cvNameInput}
              onChange={(e) => setCvNameInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My CV"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCVNameModal(false);
                  setPendingSaveData(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 