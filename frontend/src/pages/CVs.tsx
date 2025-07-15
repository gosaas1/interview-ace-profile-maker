import { useState, useEffect } from 'react';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, Eye, Edit, Trash2, Calendar, Upload, Brain } from 'lucide-react';
import { CVData, cvOperations } from '@/lib/supabase';
import { toast } from 'sonner';
import CVPreviewModal from '@/components/cv/CVPreviewModal';
import CVUploadModal from '@/components/cv/CVUploadModal';
import { CVBuilderRefactored } from '@/components/cv/CVBuilderRefactored';
import { CVAnalysis } from '@/components/cv/CVAnalysis';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/3d-card';

export const CVs = () => {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);
  const [analyzingCV, setAnalyzingCV] = useState<CVData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCVBuilder, setShowCVBuilder] = useState(false);
  const [editingCV, setEditingCV] = useState<CVData | null>(null);
  const [newlyUploadedCVId, setNewlyUploadedCVId] = useState<string | null>(null);

  useEffect(() => {
    loadCVs();
  }, []);

  // Check for analysis parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const analyzeCVId = urlParams.get('analyze');
    if (analyzeCVId) {
      const cvToAnalyze = cvs.find(cv => cv.id === analyzeCVId);
      if (cvToAnalyze) {
        setAnalyzingCV(cvToAnalyze);
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [cvs]);

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

  const handleAnalyzeCV = async (cvId: string) => {
    const cvToAnalyze = cvs.find(cv => cv.id === cvId);
    if (cvToAnalyze) {
      setAnalyzingCV(cvToAnalyze);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateCVText = (cv: CVData): string => {
    // Convert CV data to plain text for AI analysis
    let cvText = `${cv.full_name}\n`;
    if (cv.email) cvText += `Email: ${cv.email}\n`;
    if (cv.phone) cvText += `Phone: ${cv.phone}\n`;
    if (cv.location) cvText += `Location: ${cv.location}\n\n`;
    
    if (cv.summary) cvText += `PROFESSIONAL SUMMARY\n${cv.summary}\n\n`;
    
    if (cv.experiences && cv.experiences.length > 0) {
      cvText += `WORK EXPERIENCE\n`;
      cv.experiences.forEach(exp => {
        cvText += `${exp.role} at ${exp.company} (${exp.duration})\n`;
        cvText += `${exp.description}\n\n`;
      });
    }
    
    if (cv.education && cv.education.length > 0) {
      cvText += `EDUCATION\n`;
      cv.education.forEach(edu => {
        cvText += `${edu.degree} - ${edu.institution} (${edu.year})`;
        if (edu.gpa) cvText += ` - GPA: ${edu.gpa}`;
        cvText += `\n`;
      });
      cvText += `\n`;
    }
    
    if (cv.skills) cvText += `SKILLS\n${cv.skills}\n\n`;
    if (cv.certifications) cvText += `CERTIFICATIONS\n${cv.certifications}\n\n`;
    
    return cvText.trim();
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
                  <Button 
                    variant="outline"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
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
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
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
                              className="text-gray-600 hover:text-gray-900 min-h-[44px] min-w-[44px]"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/cv-builder/${cv.id}`)}
                              className="text-gray-600 hover:text-gray-900 min-h-[44px] min-w-[44px]"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAnalyzingCV(cv)}
                              className="text-purple-600 hover:text-purple-700 min-h-[44px] min-w-[44px]"
                            >
                              <Brain className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Analyze</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCV(cv.id)}
                              className="text-red-600 hover:text-red-700 min-h-[44px] min-w-[44px]"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
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
          onClose={() => setSelectedCV(null)}
          cv={selectedCV}
          onSaved={loadCVs}
          onAnalyze={handleAnalyzeCV}
          isNewUpload={false}
        />
      )}

      {/* CV Upload Modal */}
      {showUploadModal && (
        <CVUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            loadCVs(); // Refresh CV list
            toast.success('CV uploaded successfully!');
          }}
        />
      )}

      {/* AI Analysis Modal */}
      {analyzingCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">AI CV Analysis - {analyzingCV.full_name}</h2>
              <Button 
                variant="ghost" 
                onClick={() => setAnalyzingCV(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <CVAnalysis
                cvId={analyzingCV.id}
                cvText={generateCVText(analyzingCV)}
                onAnalysisComplete={(analysis) => {
                  toast.success(`Analysis complete! Your CV scored ${analysis.overallScore}/100`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CV Builder Modal */}
      {showCVBuilder && (
        <CVBuilderRefactored
          onClose={() => {
            setShowCVBuilder(false);
            setEditingCV(null);
          }}
          onSuccess={() => {
            setShowCVBuilder(false);
            setEditingCV(null);
            loadCVs(); // Refresh CV list
            toast.success('CV saved successfully!');
          }}
          editingCV={editingCV || undefined}
        />
      )}
    </>
  );
}; 