import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  FileText,
  Send,
  Star,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface JobData {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  sourceURL?: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  appliedAt?: string;
}

interface CVData {
  id: string;
  title: string;
  full_name: string;
  job_title: string;
  created_at: string;
  updated_at: string;
}

const JobApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  
  const [job, setJob] = useState<JobData | null>(null);
  const [userCVs, setUserCVs] = useState<CVData[]>([]);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'applying' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Load job and CV data on component mount
  useEffect(() => {
    if (jobId && user) {
      loadJobData();
      loadUserCVs();
    }
  }, [jobId, user]);

  const loadJobData = async () => {
    try {
      const response = await fetch(`/api/job/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const jobData = await response.json();
        setJob(jobData);
      } else {
        throw new Error('Failed to load job data');
      }
    } catch (error) {
      console.error('Error loading job:', error);
      setError('Failed to load job details');
      toast.error('Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCVs = async () => {
    try {
      const response = await fetch('/api/cv/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const cvs = await response.json();
        setUserCVs(cvs);
        if (cvs.length > 0) {
          setSelectedCV(cvs[0]); // Auto-select first CV
        }
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
      toast.error('Failed to load your CVs');
    }
  };

  const handleOneClickApply = async () => {
    if (!selectedCV || !job) {
      toast.error('Please select a CV to apply with');
      return;
    }

    setIsApplying(true);
    setApplicationStatus('applying');

    try {
      // Mark job as applied
      const response = await fetch(`/api/job/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to apply to job' }));
        throw new Error(errorData.message || 'Failed to apply to job');
      }

      const result = await response.json();
      
      setApplicationStatus('success');
      toast.success('Application submitted successfully!');
      
      // Update job status locally
      setJob(prev => prev ? { ...prev, status: 'applied', appliedAt: new Date().toISOString() } : null);

      // Navigate to interview coaching after a short delay
      setTimeout(() => {
        navigate(`/interview?job=${jobId}`);
      }, 2000);

    } catch (err: any) {
      console.error('Error applying to job:', err);
      setError(err.message || 'Failed to apply to job');
      setApplicationStatus('error');
      toast.error(err.message || 'Failed to apply to job');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!job) return;

    try {
      const response = await fetch('/api/job/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          rawJD: job.description,
          sourceURL: job.sourceURL
        }),
      });

      if (response.ok) {
        toast.success('Job saved to your list!');
      } else {
        throw new Error('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'applied': return 'bg-green-100 text-green-800 border-green-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offer': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The job you\'re looking for doesn\'t exist or has been removed.'}</p>
          <Button onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Job Application</h1>
                <p className="text-sm text-gray-500">Apply to {job.companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(job.status)}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {job.jobTitle}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      <Building2 className="h-4 w-4 inline mr-2" />
                      {job.companyName}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveJob}
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Save
                    </Button>
                    {job.sourceURL && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(job.sourceURL, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{job.jobType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {job.description}
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                {job.status === 'applied' && job.appliedAt && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      You applied to this position on {new Date(job.appliedAt).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Quick Apply
                </CardTitle>
                <CardDescription>
                  Select your CV and apply with one click
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CV Selection */}
                <div className="space-y-3">
                  <h4 className="font-medium">Select CV</h4>
                  <div className="space-y-2">
                    {userCVs.map((cv) => (
                      <div
                        key={cv.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedCV?.id === cv.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCV(cv)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{cv.title || cv.full_name}</p>
                            <p className="text-xs text-gray-500">
                              Updated {new Date(cv.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedCV?.id === cv.id && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Status */}
                {applicationStatus === 'success' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Application submitted successfully! Redirecting to interview prep...
                    </AlertDescription>
                  </Alert>
                )}

                {applicationStatus === 'error' && error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleOneClickApply}
                    disabled={isApplying || !selectedCV || job.status === 'applied'}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : job.status === 'applied' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Applied
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        One-Click Apply
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate(`/cover-letter?jobId=${jobId}`)}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Cover Letter
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate(`/interview?job=${jobId}`)}
                    className="w-full"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Practice Interview
                  </Button>
                </div>

                {/* Application Tips */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Application Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your CV will be automatically tailored to this job</li>
                    <li>• Generate a cover letter for better chances</li>
                    <li>• Practice interview questions specific to this role</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobApplyPage; 
 
 