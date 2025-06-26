import { useState, useEffect } from 'react';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, Eye, Edit, Trash2, Calendar, Upload } from 'lucide-react';
import { CVData, cvOperations } from '@/lib/supabase';
import { toast } from 'sonner';
import CVPreviewModal from '@/components/cv/CVPreviewModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/3d-card';

export const CVs = () => {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);

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
    if (!confirm('Are you sure you want to delete this CV?')) return;
    
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
      <div className="min-h-screen bg-gray-50">        
        <main className="overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My CVs</h1>
                  <p className="mt-2 text-gray-600">
                    Manage and optimize your CVs for different roles
                  </p>
                </div>
                <div className="flex space-x-2">
                  {/* Disabled as per platform restructure - Upload CV only available on home page */}
                  {/* <Button 
                    variant="outline"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button> */}
                  <Button onClick={() => navigate('/cv-builder')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New CV
                  </Button>
                </div>
              </div>
            </div>

            {cvs.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No CVs found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Create your first CV to get started with your job search journey. 
                  Upload an existing CV or build one from scratch.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Disabled as per platform restructure - Upload CV only available on home page */}
                  {/* <Button 
                    variant="outline" 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button> */}
                  <Button onClick={() => navigate('/cv-builder')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New CV
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div 
                className="grid gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {cvs.map((cv, index) => (
                  <FloatingCard key={cv.id} delay={index * 0.1}>
                    <Card className="p-6 card-3d glow-blue">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <motion.div 
                              className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <FileText className="h-6 w-6 text-blue-600" />
                            </motion.div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {cv.full_name || 'Untitled CV'}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Created {formatDate(cv.created_at)}
                            </div>
                            {cv.file_name && (
                              <div className="text-sm text-gray-500 mt-1">
                                File: {cv.file_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCV(cv)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/cv-builder/${cv.id}`)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCV(cv.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </FloatingCard>
                ))}
              </motion.div>
            )}
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
    </>
  );
}; 