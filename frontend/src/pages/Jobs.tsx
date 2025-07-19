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
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
          <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Job Opportunities
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Discover and apply to jobs that match your skills and experience
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Jobs
                  </Button>
                  <Button 
                    onClick={() => navigate('/apply')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    One-Click Apply
                  </Button>
                </div>
          </div>

              {/* Search Bar */}
              <div className="mt-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                  placeholder="Search for jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                  <Card className="h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{job.company}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{job.matchScore}%</span>
                          </div>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Match
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                            <MapPin className="w-3 h-3 text-gray-500" />
                    </div>
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                            <Clock className="w-3 h-3 text-gray-500" />
                          </div>
                          {job.type}
                      </div>
                      <div className="flex items-center text-gray-600">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                            <DollarSign className="w-3 h-3 text-gray-500" />
                          </div>
                          {job.salary}
                      </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {job.description}
                      </p>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                          }}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                      </Button>
                      <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyToJob(job);
                          }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          Apply Now
                      </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {mockJobs.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No jobs found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Try adjusting your search criteria or check back later for new opportunities.
                    </p>
                <Button 
                  onClick={() => navigate('/apply')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  One-Click Apply
                </Button>
              </div>
            )}
          </div>
        </main>
        </div>

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
    </>
  );
}; 