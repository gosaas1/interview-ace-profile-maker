import { useState, useEffect } from 'react';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-64 fixed left-0 top-0 h-full">
          <HomeNavigation />
        </div>
        <main className="ml-64 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    My CVs
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage and optimize your CVs for different roles
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowUploadModal(true)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                  <Button 
                    onClick={() => navigate('/cv-builder')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Base CV
                  </Button>
                </div>
              </div>
              
              {/* Intent Explanation */}
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">CV Building vs Job Application</h4>
                    <p className="text-blue-800 mb-4 leading-relaxed">
                      <strong>CV Builder:</strong> Create and edit your base CV with professional templates and sections. 
                      <strong> Apply for Jobs:</strong> Use your base CV to quickly tailor applications for specific positions with AI-powered optimization.
                    </p>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/cv-builder')}
                        className="text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-400"
                      >
                        Build Base CV
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/apply')}
                        className="text-green-700 border-green-300 hover:bg-green-100 hover:border-green-400"
                      >
                        Apply to Jobs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {cvs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No CVs found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Create your first CV to get started with your job search journey. 
                  Upload an existing CV or build one from scratch with our professional templates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setShowUploadModal(true)}
                    variant="outline"
                    size="lg"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Existing CV
                  </Button>
                  <Button 
                    onClick={() => navigate('/cv-builder')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New CV
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvs.map((cv) => (
                  <motion.div 
                    key={cv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {cv.full_name || 'Untitled CV'}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(cv.created_at)}
                            </div>
                            {cv.summary && (
                              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                {cv.summary}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {cv.experiences && cv.experiences.length > 0 && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              {cv.experiences.length} Experience{cv.experiences.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {cv.education && cv.education.length > 0 && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              {cv.education.length} Education{cv.education.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {cv.skills && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                              Skills Included
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCV(cv)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCV(cv)}
                              className="text-gray-600 hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAnalyzeCV(cv.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <Brain className="h-4 w-4" />
                            </Button>
                          </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCV(cv.id)}
                            className="text-red-600 hover:bg-red-50"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
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

export default CVs; 