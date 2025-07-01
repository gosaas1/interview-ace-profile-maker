import { useState } from 'react';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign,
  Filter,
  Search,
  Star,
  ExternalLink,
  Brain,
  Award,
  FileText,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/3d-card';
import { AnimatedCounter } from '@/components/ui/counter';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { JobApplicationsService, JobApplication, CVData, JobData } from '@/lib/jobApplications';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  matchScore: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    description: 'We are looking for a Senior Software Engineer to join our team...',
    matchScore: 95
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $110k',
    description: 'Join our team as a Frontend Developer and help build amazing web applications...',
    matchScore: 88
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100k - $130k',
    description: 'Looking for a Full Stack Developer to work on exciting projects...',
    matchScore: 92
  }
];

export const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [userCVs, setUserCVs] = useState<any[]>([]);
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const navigate = useNavigate();

  // Handle one-button apply
  const handleApplyToJob = async (job: Job) => {
    setSelectedJobForApply(job);
    
    try {
      // Convert job to JobData format
      const jobData: JobData = {
        id: job.id,
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        job_type: job.type
      };

      // Get best CV for this job using the service
      const bestCV = await JobApplicationsService.getBestCVForJob(jobData);
      
      if (bestCV) {
        setSelectedCV(bestCV);
        setUserCVs([bestCV]); // Show only the best CV
      } else {
        // Fallback: fetch all CVs if no best match found
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: cvs } = await supabase
            .from('cvs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          setUserCVs(cvs || []);
          if (cvs && cvs.length > 0) {
            setSelectedCV(cvs[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error preparing job application:', error);
      toast.error('Failed to prepare application');
    }
    
    setShowApplyModal(true);
  };

  // Generate cover letter
  const generateCoverLetter = async () => {
    if (!selectedCV || !selectedJobForApply) return;
    
    setIsGeneratingCoverLetter(true);
    try {
      // Convert to proper data formats
      const cvData: CVData = {
        id: selectedCV.id,
        full_name: selectedCV.full_name,
        job_title: selectedCV.job_title,
        email: selectedCV.email,
        summary: selectedCV.summary,
        skills: selectedCV.skills,
        experiences: selectedCV.experiences,
        education: selectedCV.education
      };

      const jobData: JobData = {
        id: selectedJobForApply.id,
        title: selectedJobForApply.title,
        company: selectedJobForApply.company,
        description: selectedJobForApply.description,
        location: selectedJobForApply.location,
        job_type: selectedJobForApply.type
      };

      // Use the service to generate cover letter
      const generatedCoverLetter = await JobApplicationsService.generateCoverLetter(cvData, jobData);
      
      setCoverLetter(generatedCoverLetter);
      toast.success('Cover letter generated successfully!');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // Submit application
  const submitApplication = async () => {
    if (!selectedCV || !selectedJobForApply || !coverLetter) {
      toast.error('Please select a CV and generate a cover letter');
      return;
    }
    
    try {
      // Create application object
      const application: JobApplication = {
        cv_id: selectedCV.id,
        job_title: selectedJobForApply.title,
        company_name: selectedJobForApply.company,
        job_url: '', // TODO: Add job URL if available
        job_description: selectedJobForApply.description,
        status: 'applied',
        priority: 'medium',
        salary_range: selectedJobForApply.salary,
        location: selectedJobForApply.location,
        job_type: selectedJobForApply.type,
        cover_letter: coverLetter
      };

      // Save application using the service
      const savedApplication = await JobApplicationsService.createApplication(application);
      
      if (savedApplication) {
        setShowApplyModal(false);
        setSelectedJobForApply(null);
        setSelectedCV(null);
        setCoverLetter('');
        
        // Navigate to interview coaching for this job
        navigate(`/interview?job=${selectedJobForApply.id}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64">
        <HomeNavigation />
      </div>
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Matches</h1>
            <p className="mt-2 text-gray-600">
              Find your next opportunity based on your CV and preferences
            </p>
          </div>

          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {mockJobs.map((job, index) => (
                <FloatingCard key={job.id} delay={index * 0.1}>
                  <Card 
                    className={`p-6 cursor-pointer card-3d ${
                      selectedJob?.id === job.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50 glow-blue' 
                        : 'glow-green'
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Building2 className="h-4 w-4 mr-2" />
                          </motion.div>
                          {job.company}
                        </div>
                      </div>
                      <motion.div 
                        className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="h-4 w-4 mr-1" />
                        </motion.div>
                        <AnimatedCounter value={job.matchScore} suffix="%" /> Match
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02 }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {job.type}
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02 }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salary}
                      </motion.div>
                    </div>

                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  </Card>
                </FloatingCard>
              ))}
            </motion.div>

            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {selectedJob ? (
                <motion.div
                  key={selectedJob.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 sticky top-8 card-3d glow-purple">
                    <motion.h2 
                      className="text-xl font-semibold mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {selectedJob.title}
                    </motion.h2>
                    <motion.div 
                      className="space-y-4 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {selectedJob.company}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {selectedJob.type}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {selectedJob.salary}
                      </div>
                    </motion.div>

                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white min-h-[44px]"
                        onClick={() => handleApplyToJob(selectedJob)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply with CV
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full min-h-[44px]"
                        onClick={() => navigate('/cvs?analyze=job')}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze CV for This Job
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full min-h-[44px]"
                        onClick={() => navigate('/interview?job=' + selectedJob.id)}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Practice Interview for This Job
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full min-h-[44px]"
                        onClick={() => {
                          toast.success('Job saved to favorites!');
                        }}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Save Job
                      </Button>
                    </motion.div>

                    <motion.div 
                      className="mt-6 p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                      <p className="text-sm text-gray-600 line-clamp-4">
                        {selectedJob.description}
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 mt-2"
                        onClick={() => {
                          toast.info('Full job description would open here');
                        }}
                      >
                        Read More
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 text-center card-3d glow-gray">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Job</h3>
                    <p className="text-gray-600">
                      Click on a job to view details and take action
                    </p>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* One-Button Apply Modal */}
      {showApplyModal && selectedJobForApply && (
        <Dialog open={showApplyModal} onOpenChange={() => setShowApplyModal(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply to {selectedJobForApply.title}</DialogTitle>
              <DialogDescription>
                Select your CV, customize it for this job, and generate a cover letter.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* CV Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select CV</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userCVs.map((cv) => (
                    <Card 
                      key={cv.id} 
                      className={`cursor-pointer ${selectedCV?.id === cv.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedCV(cv)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium">{cv.full_name}</h4>
                        <p className="text-sm text-gray-600">{cv.job_title}</p>
                        <p className="text-xs text-gray-500">Created: {new Date(cv.created_at).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Cover Letter */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Cover Letter</h3>
                  <Button 
                    onClick={generateCoverLetter} 
                    disabled={!selectedCV || isGeneratingCoverLetter}
                    size="sm"
                  >
                    {isGeneratingCoverLetter ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Cover Letter
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Your cover letter will appear here after generation..."
                  rows={8}
                />
              </div>
              
              {/* Application Package Preview */}
              {selectedCV && coverLetter && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Application Package</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">CV:</span>
                        <span className="text-sm text-gray-600">{selectedCV.full_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Cover Letter:</span>
                        <span className="text-sm text-gray-600">{coverLetter.length} characters</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitApplication}
                disabled={!selectedCV || !coverLetter}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}; 