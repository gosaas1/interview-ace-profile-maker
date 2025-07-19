import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Send, 
  FileText, 
  Briefcase, 
  Target, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Download,
  Eye,
  Brain,
  Sparkles,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTier } from '@/hooks/useTier';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CV {
  id: string;
  name: string;
  template: string;
  lastModified: Date;
  personalInfo: {
    fullName: string;
    email: string;
    summary: string;
  };
}

interface JobApplication {
  jobTitle: string;
  company: string;
  jobDescription: string;
  tailoredCV: any;
  coverLetter: string;
  applicationDate: Date;
  status: 'pending' | 'submitted' | 'interview' | 'rejected' | 'accepted';
}

export default function OneClickApplyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tierInfo, canPerformAction } = useTier();
  
  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedCV, setSelectedCV] = useState<string>('');
  const [userCVs, setUserCVs] = useState<CV[]>([]);
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'processing' | 'review' | 'complete'>('input');
  const [progress, setProgress] = useState(0);
  
  // Results
  const [tailoredCV, setTailoredCV] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationCost, setApplicationCost] = useState(0);
  
  // Check tier permissions
  const canApply = canPerformAction('job_apply');
  const applyLimit = tierInfo?.limits?.job_applications_per_month || 0;
  const appliesUsed = tierInfo?.usage?.job_applications || 0;

  useEffect(() => {
    if (user) {
      loadUserCVs();
    }
  }, [user]);

  const loadUserCVs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/cv/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserCVs(data.cvs || []);
        if (data.cvs && data.cvs.length > 0) {
          setSelectedCV(data.cvs[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
      toast.error('Failed to load your CVs');
    }
  };

  const handleJobDescriptionPaste = (text: string) => {
    setJobDescription(text);
    
    // Try to extract job title and company from pasted text
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('job title') || line.toLowerCase().includes('position')) {
        const match = line.match(/[A-Z][a-z\s]+(?:Engineer|Manager|Developer|Designer|Analyst|Specialist|Coordinator|Director|Lead|Senior|Junior)/i);
        if (match) {
          setJobTitle(match[0].trim());
        }
      }
      if (line.toLowerCase().includes('company') || line.toLowerCase().includes('organization')) {
        const match = line.match(/[A-Z][a-zA-Z\s&]+(?:Inc|Corp|LLC|Ltd|Company|Organization)/i);
        if (match) {
          setCompany(match[0].trim());
        }
      }
    }
  };

  const processApplication = async () => {
    if (!canApply) {
      toast.error('Upgrade your tier to access job applications');
      return;
    }

    if (!jobDescription.trim() || !selectedCV) {
      toast.error('Please provide a job description and select a CV');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');
    setProgress(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Step 1: Analyze job description (20%)
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Tailor CV to job (50%)
      setProgress(50);
      const cvResponse = await fetch('/api/cv/tailor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cvId: selectedCV,
          jobDescription,
          jobTitle,
          company
        })
      });

      if (!cvResponse.ok) {
        throw new Error('Failed to tailor CV');
      }

      const tailoredCVData = await cvResponse.json();
      setTailoredCV(tailoredCVData);

      // Step 3: Generate cover letter (80%)
      setProgress(80);
      const coverLetterResponse = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobDescription,
          jobTitle,
          company,
          cvData: tailoredCVData
        })
      });

      if (!coverLetterResponse.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const coverLetterData = await coverLetterResponse.json();
      setCoverLetter(coverLetterData.coverLetter);
      setApplicationCost(coverLetterData.cost || 0.50);

      // Step 4: Complete (100%)
      setProgress(100);
      setCurrentStep('review');

    } catch (error) {
      console.error('Application processing error:', error);
      toast.error('Failed to process application. Please try again.');
      setCurrentStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const submitApplication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/job/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescription,
          tailoredCV,
          coverLetter,
          originalCVId: selectedCV,
          cost: applicationCost
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setCurrentStep('complete');
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit application');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

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
                <h1 className="text-xl font-semibold text-gray-900">One-Click Apply</h1>
                <p className="text-sm text-gray-500">
                  Tailor your CV and generate a cover letter for this specific job
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600">
                <Zap className="h-3 w-3 mr-1" />
                Fast Mode
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tier Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant={tierInfo?.currentTier === 'pro' ? 'default' : 'secondary'}>
                  {tierInfo?.currentTier?.toUpperCase()} TIER
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {appliesUsed} / {applyLimit} applications used this month
                </span>
              </div>
              <Progress 
                value={(appliesUsed / applyLimit) * 100} 
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>

        {currentStep === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Job Information</span>
                </CardTitle>
                <CardDescription>
                  Provide the job details to tailor your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g., Tech Company Inc."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Job Description</label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => handleJobDescriptionPaste(e.target.value)}
                    placeholder="Paste the full job description here... We'll automatically extract key requirements and tailor your CV accordingly."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Tip: Paste the complete job posting for best results
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CV Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Select Base CV</span>
                </CardTitle>
                <CardDescription>
                  Choose which CV to tailor for this job application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userCVs.length > 0 ? (
                  <Select value={selectedCV} onValueChange={setSelectedCV}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a CV" />
                    </SelectTrigger>
                    <SelectContent>
                      {userCVs.map((cv) => (
                        <SelectItem key={cv.id} value={cv.id}>
                          <div className="flex items-center space-x-2">
                            <span>{cv.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {cv.template}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      No CVs found. Please create a base CV first in the{' '}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto" 
                        onClick={() => navigate('/cv-builder')}
                      >
                        CV Builder
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Action */}
            <div className="flex justify-center">
              <Button
                onClick={processApplication}
                disabled={!canApply || !jobDescription.trim() || !selectedCV || isProcessing}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Tailor & Generate Application
                  </>
                )}
              </Button>
            </div>

            {!canApply && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upgrade to Pro tier to access unlimited job applications with AI tailoring.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}

        {currentStep === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <Brain className="h-12 w-12 mx-auto text-blue-600 animate-pulse" />
                  <h2 className="text-xl font-semibold">AI is Tailoring Your Application</h2>
                  <p className="text-muted-foreground">
                    Analyzing job requirements and optimizing your CV...
                  </p>
                  
                  <div className="w-full max-w-md mx-auto">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {progress < 30 && 'Analyzing job requirements...'}
                      {progress >= 30 && progress < 60 && 'Tailoring CV content...'}
                      {progress >= 60 && progress < 90 && 'Generating cover letter...'}
                      {progress >= 90 && 'Finalizing application...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 'review' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Application Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Application Ready</span>
                </CardTitle>
                <CardDescription>
                  Review your tailored application before submitting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Job</h4>
                    <p className="text-sm text-blue-800">{jobTitle}</p>
                    <p className="text-xs text-blue-700">{company}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">CV Status</h4>
                    <p className="text-sm text-green-800">Tailored & Optimized</p>
                    <Badge variant="outline" className="text-xs text-green-600">
                      ATS Optimized
                    </Badge>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Cost</h4>
                    <p className="text-sm text-purple-800">${applicationCost.toFixed(2)}</p>
                    <p className="text-xs text-purple-700">AI Processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tailored CV Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Tailored CV Preview</span>
                </CardTitle>
                <CardDescription>
                  Your CV has been optimized for this specific job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Key Changes Made:</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(tailoredCV), 'CV')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/cv-builder', { state: { cvData: tailoredCV } })}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Full
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium mb-2">Summary Updates:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Enhanced with job-specific keywords</li>
                      <li>• Reordered experience to match job requirements</li>
                      <li>• Updated skills section with relevant technologies</li>
                      <li>• Optimized for ATS compatibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  <span>Generated Cover Letter</span>
                </CardTitle>
                <CardDescription>
                  AI-generated cover letter tailored to this position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(coverLetter, 'Cover Letter')}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([coverLetter], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `cover-letter-${company}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-white border rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{coverLetter}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Application */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setCurrentStep('input')}
                variant="outline"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Edit
              </Button>
              
              <Button
                onClick={submitApplication}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Application
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                  <h2 className="text-2xl font-bold text-green-900">Application Submitted!</h2>
                  <p className="text-muted-foreground">
                    Your tailored application has been submitted successfully.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium">Next Steps</h4>
                      <p className="text-sm text-muted-foreground">
                        Track your application in the Jobs section
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium">Interview Prep</h4>
                      <p className="text-sm text-muted-foreground">
                        Practice with our AI Interview Coach
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium">More Applications</h4>
                      <p className="text-sm text-muted-foreground">
                        Apply to more jobs with one-click
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    <Button
                      onClick={() => navigate('/jobs')}
                      variant="outline"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      View Applications
                    </Button>
                    <Button
                      onClick={() => navigate('/interview-coach')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Practice Interview
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentStep('input');
                        setJobTitle('');
                        setCompany('');
                        setJobDescription('');
                      }}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Apply to Another Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
} 
 
 