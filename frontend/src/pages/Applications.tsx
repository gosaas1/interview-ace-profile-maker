import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Building, MapPin, Loader2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface JobApplication {
  id: string;
  user_id: string;
  job_title: string;
  company_name: string;
  job_url: string;
  location: string;
  status: 'pending' | 'interview' | 'rejected' | 'offer';
  application_date: string;
  match_score: number;
  tailored_cv: string;
  cover_letter: string;
  notes?: string;
  created_at: string;
}

const Applications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
      toast({
        title: "Error",
        description: "Failed to load your applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'offer': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (application: JobApplication) => {
    toast({
      title: "Application Details",
      description: `Viewing details for ${application.job_title} at ${application.company_name}`,
    });
  };

  const handleEditApplication = (application: JobApplication) => {
    toast({
      title: "Edit Application",
      description: `Editing application for ${application.job_title}`,
    });
  };

  const handleAddNote = (application: JobApplication) => {
    toast({
      title: "Add Note",
      description: `Adding note to ${application.job_title} application`,
    });
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchApplications}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  My Applications
                </h1>
                <p className="text-sm text-gray-500">Track your job applications and progress</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/80 backdrop-blur-sm p-1 rounded-lg w-fit shadow-sm border border-gray-200/50">
          {['all', 'pending', 'interview', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "ghost"}
              onClick={() => setFilter(status)}
              className={`capitalize ${
                filter === status 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {application.job_title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{application.company_name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getStatusColor(application.status)} font-medium`}>
                        {application.status}
                      </Badge>
                      {application.match_score && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                          {application.match_score}% Match
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <MapPin className="w-3 h-3 text-gray-500" />
                      </div>
                      {application.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                      </div>
                      Applied: {new Date(application.application_date).toLocaleDateString()}
                    </div>
                    <div className="text-blue-600 font-semibold">
                      {application.job_url && (
                        <a 
                          href={application.job_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-700 transition-colors"
                        >
                          View Job Posting →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(application)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditApplication(application)}
                      className="text-gray-600 border-gray-200 hover:bg-gray-50"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddNote(application)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No applications found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {filter === 'all' 
                  ? "You haven't submitted any job applications yet. Start applying to jobs to track your progress here."
                  : `No ${filter} applications found. Try adjusting your filters or submit new applications.`
                }
              </p>
              {filter === 'all' && (
                <Button 
                  onClick={() => navigate('/apply')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Start Applying
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Applications; 