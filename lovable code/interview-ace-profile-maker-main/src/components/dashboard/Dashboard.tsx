import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { cvOperations, CVData } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { FileText, Upload, Plus, Eye, Edit, Trash2, Calendar, TrendingUp, Award, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import CVPreviewModal from '../cv/CVPreviewModal';
import CVUploadModal from '../cv/CVUploadModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/counter';
import { FloatingCard } from '@/components/ui/3d-card';
import BackendTest from '@/components/debug/BackendTest';
import { JobsAppliedCarousel } from '@/components/dashboard/JobsAppliedCarousel';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);
  const [showCVUpload, setShowCVUpload] = useState(false);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      const data = await cvOperations.getAllCVs();
      setCvs(data);
    } catch (error: any) {
      toast.error('Failed to load CVs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      await cvOperations.deleteCV(cvId);
      await loadCVs();
      toast.success('CV deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete CV: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64">
          <HomeNavigation />
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <HomeNavigation />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.user_metadata?.full_name || user?.email}! Ready to advance your career?
              </p>
            </div>

            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              <FloatingCard delay={0.1}>
                <Card className="card-3d glow-blue">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter value={cvs.length} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cvs.length > 0 ? '+1 from last month' : 'Start building your first CV'}
                    </p>
                  </CardContent>
                </Card>
              </FloatingCard>
              
              <FloatingCard delay={0.2}>
                <Card className="card-3d glow-green">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter value={0} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ready to start applying
                    </p>
                  </CardContent>
                </Card>
              </FloatingCard>
              
              <FloatingCard delay={0.3}>
                <Card className="card-3d glow-purple">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interview Prep</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter value={0} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Practice sessions completed
                    </p>
                  </CardContent>
                </Card>
              </FloatingCard>
              
              <FloatingCard delay={0.4}>
                <Card className="card-3d glow-pink">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter value={0} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Personalized matches available
                    </p>
                  </CardContent>
                </Card>
              </FloatingCard>
            </motion.div>

            {/* Upgrade Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-blue-900">Unlock Premium Features</CardTitle>
                        <CardDescription className="text-blue-700">
                          Get unlimited CV analyses, advanced AI features, and expert coaching
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/pricing')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Plans
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Unlimited CV analyses with GPT-4</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-700">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Human expert review & coaching</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-700">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Advanced job matching & analytics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Jobs Applied Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <JobsAppliedCarousel />
            </motion.div>

            {/* CVs Section */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My CVs</CardTitle>
                  <CardDescription>
                    Manage and optimize your CVs for different roles
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowCVUpload(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                  <Button onClick={() => navigate('/cv-builder')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New CV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cvs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No CVs found</h3>
                    <p className="text-slate-500 mb-6">
                      Create your first CV to get started with your job search journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={() => setShowCVUpload(true)} variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Existing CV
                      </Button>
                      <Button onClick={() => navigate('/cv-builder')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New CV
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {cvs.map((cv) => (
                      <div key={cv.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {cv.full_name || 'Untitled CV'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              <Calendar className="inline h-4 w-4 mr-1" />
                              Created {formatDate(cv.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCV(cv)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/cv-builder/${cv.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCV(cv.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/jobs')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Find Job Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Discover personalized job opportunities based on your CV and preferences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/interviews')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-600" />
                    Practice Interviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Improve your interview skills with AI-powered practice sessions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/cv-builder')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Optimize CVs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Create and optimize your CVs for specific job applications.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Backend Test Component - Temporary for debugging */}
            <div className="mt-8">
              <BackendTest />
            </div>
          </div>
        </main>
      </div>

      {/* CV Preview Modal */}
      {selectedCV && (
        <CVPreviewModal
          open={!!selectedCV}
          cv={selectedCV}
          onClose={() => setSelectedCV(null)}
        />
      )}

      {/* CV Upload Modal */}
      {showCVUpload && (
        <CVUploadModal
          onClose={() => setShowCVUpload(false)}
          onSuccess={() => {
            setShowCVUpload(false);
            loadCVs(); // Refresh CV list
            toast.success('CV uploaded successfully!');
          }}
        />
      )}
    </>
  );
}
