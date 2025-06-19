import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Briefcase, ExternalLink, Edit, FileText, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import JobTailorModal from './JobTailorModal';
import { CVBuilder } from '../cv/CVBuilder';
import CVPreviewModal from '../cv/CVPreviewModal';

interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  job_url: string;
  description: string;
  created_at: string;
}

interface CV {
  id: string;
  job_id: string | null;
  full_name: string;
  email: string;
  updated_at: string;
  phone?: string;
  location?: string;
  summary?: string;
  experiences?: any[];
  education?: any[];
  skills?: string;
  certifications?: string;
}

const JobFoldersList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [cvs, setCVs] = useState<CV[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showCVBuilder, setShowCVBuilder] = useState(false);
  const [cvBuilderJobId, setCVBuilderJobId] = useState<string | null>(null);
  const [editingCV, setEditingCV] = useState<CV | null>(null);
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [previewCV, setPreviewCV] = useState<CV | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        if (jobsError) throw jobsError;
        setJobs(jobsData || []);
        // Fetch all CVs for this user
        const { data: cvsData, error: cvsError } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', session.user.id);
        if (cvsError) throw cvsError;
        setCVs(cvsData || []);
      }
    } catch (error) {
      setJobs([]);
      setCVs([]);
    } finally {
      setLoading(false);
    }
  };

  // Add Job
  const handleAddJob = () => {
    setEditingJob(null);
    setShowJobModal(true);
  };

  // Edit Job
  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobModal(true);
  };

  // Delete Job
  const handleDeleteJob = async (job: Job) => {
    if (!window.confirm('Are you sure you want to delete this job and all tailored CVs?')) return;
    await supabase.from('jobs').delete().eq('id', job.id);
    fetchJobs();
  };

  // Save Job (from modal)
  const handleJobModalSave = async (jobData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    if (editingJob) {
      // Update
      await supabase.from('jobs').update({
        title: jobData.jobTitle,
        company: jobData.company,
        job_url: jobData.jobUrl,
        description: jobData.jobDescription
      }).eq('id', editingJob.id);
    } else {
      // Insert
      await supabase.from('jobs').insert({
        user_id: session.user.id,
        title: jobData.jobTitle,
        company: jobData.company,
        job_url: jobData.jobUrl,
        description: jobData.jobDescription
      });
    }
    setShowJobModal(false);
    setEditingJob(null);
    fetchJobs();
  };

  // Tailor New CV
  const handleTailorCV = (jobId: string) => {
    setEditingCV(null);
    setCVBuilderJobId(jobId);
    setShowCVBuilder(true);
  };

  // Edit CV
  const handleEditCV = (cv: CV) => {
    setEditingCV(cv);
    setShowCVBuilder(true);
    setCVBuilderJobId(cv.job_id || null);
  };

  // Save CV (from builder)
  const handleCVBuilderSave = () => {
    setShowCVBuilder(false);
    setEditingCV(null);
    setCVBuilderJobId(null);
    fetchJobs();
  };

  // View CV
  const handleViewCV = (cv: CV) => {
    setPreviewCV(cv);
    setShowCVPreview(true);
  };

  // Close Preview
  const handleClosePreview = () => {
    setShowCVPreview(false);
    setPreviewCV(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Job Applications</h3>
          <p className="text-slate-600 mt-1">Track and manage your tailored applications</p>
        </div>
        <Button onClick={handleAddJob} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading job applications...</div>
      ) : jobs.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No applications yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Start your job search journey by creating your first tailored application with our AI-powered tools.
            </p>
            <Button onClick={handleAddJob} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Create First Application
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => {
            const tailoredCVs = cvs.filter((cv) => cv.job_id === job.id);
            return (
              <Card key={job.id} className="hover-lift border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div>
                        <CardTitle className="text-xl text-slate-900 mb-1">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-slate-600">
                          <Briefcase className="h-4 w-4" />
                          {job.company}
                        </CardDescription>
                        {job.job_url && (
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1">
                            <ExternalLink className="h-4 w-4" /> View Job Posting
                          </a>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {job.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600" onClick={() => handleEditJob(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteJob(job)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-slate-900">Tailored CVs</div>
                    <Button size="sm" variant="outline" className="border-slate-200 hover:bg-slate-50" onClick={() => handleTailorCV(job.id)}>
                      <FileText className="h-4 w-4 mr-2" /> Tailor New CV
                    </Button>
                  </div>
                  {tailoredCVs.length === 0 ? (
                    <div className="text-slate-500 text-sm py-4">No tailored CVs for this job yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tailoredCVs.map((cv) => (
                        <Card key={cv.id} className="border border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-semibold text-slate-900">{cv.full_name || 'Untitled CV'}</div>
                                <div className="text-xs text-slate-600">{cv.email}</div>
                              </div>
                              <div className="text-xs text-slate-500">{new Date(cv.updated_at).toLocaleDateString()}</div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewCV(cv)}>View</Button>
                              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditCV(cv)}>Edit</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {showJobModal && (
        <JobTailorModal 
          onClose={() => { setShowJobModal(false); setEditingJob(null); }}
          // Pass editingJob and onSave for edit mode
          editingJob={editingJob}
          onSave={handleJobModalSave}
        />
      )}

      {/* Tailor/Edit CV Modal */}
      {showCVBuilder && (
        <CVBuilder 
          onClose={() => { setShowCVBuilder(false); setEditingCV(null); setCVBuilderJobId(null); }}
          onSuccess={handleCVBuilderSave}
          editingCV={editingCV || undefined}
          jobId={cvBuilderJobId || undefined}
        />
      )}

      {/* CV Preview Modal */}
      {showCVPreview && (
        <CVPreviewModal 
          open={showCVPreview} 
          onClose={handleClosePreview} 
          cv={previewCV || undefined} 
        />
      )}
    </div>
  );
};

export default JobFoldersList;
