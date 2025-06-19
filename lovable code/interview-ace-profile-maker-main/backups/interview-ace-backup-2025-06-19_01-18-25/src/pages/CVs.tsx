import { useState, useEffect } from 'react';
import { supabase, CVData } from '@/lib/supabase';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Upload, Edit, Trash2, Eye, Download } from 'lucide-react';
import CVUploadModal from '@/components/cv/CVUploadModal';
import { CVBuilder } from '@/components/cv/CVBuilder';
import { toast } from 'sonner';
import CVPreviewModal from '@/components/cv/CVPreviewModal';
import CVUploadAndPreview from '@/components/cv/CVUploadAndPreview';

interface UploadedCV {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  type: 'file' | 'text';
  created_at: string;
}

export const CVs = () => {
  const [cvs, setCVs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [editingCV, setEditingCV] = useState<CVData | undefined>(undefined);
  const [previewCV, setPreviewCV] = useState<CVData | undefined>(undefined);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadedCVs, setUploadedCVs] = useState<UploadedCV[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchCVs();
    fetchUploadedCVs();
  }, [refresh]);

  const fetchCVs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCVs(data || []);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
      toast.error('Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedCVs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('uploaded_cvs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setUploadedCVs(data);
  };

  const handleEditCV = (cv: CVData) => {
    setEditingCV(cv);
    setShowBuilderModal(true);
  };

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;
      setCVs(cvs.filter(cv => cv.id !== cvId));
      toast.success('CV deleted successfully');
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  const handleViewCV = (cv: CVData) => {
    setPreviewCV(cv);
    setShowPreviewModal(true);
  };

  const handleDownloadCV = (cv: CVData) => {
    toast.info('PDF download feature coming soon!');
  };

  const handleBuilderClose = () => {
    setShowBuilderModal(false);
    setEditingCV(undefined);
  };

  const handleBuilderSuccess = () => {
    setShowBuilderModal(false);
    setEditingCV(undefined);
    fetchCVs();
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    // Refresh both CV lists
    fetchCVs();
    fetchUploadedCVs();
    setRefresh(r => !r);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64">
        <HomeNavigation />
      </div>
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 min-h-[80px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900">My CVs</h1>
              <p className="mt-2 text-gray-600">
                Create, manage, and update your professional CVs
              </p>
            </div>
            <div className="flex space-x-4 items-center">
              <Button 
                onClick={() => setShowBuilderModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white h-10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New CV
              </Button>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white h-10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CV
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload and Preview Your CV (PDF)</CardTitle>
            </CardHeader>
            <CardContent>
              <CVUploadAndPreview />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Uploaded CVs</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedCVs.length === 0 ? (
                <div className="text-slate-500">No uploaded CVs yet.</div>
              ) : (
                <ul className="space-y-4">
                  {uploadedCVs.map(cv => (
                    <li key={cv.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-900">
                              {cv.title || (cv.file_name ? cv.file_name.replace(/\.[^/.]+$/, "") : 'Untitled CV')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              cv.type === 'file' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {cv.type === 'file' ? 'File Upload' : 'Text CV'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Uploaded: {new Date(cv.created_at).toLocaleDateString()}</p>
                            {cv.file_size && (
                              <p>Size: {(cv.file_size / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                            {cv.content && (
                              <p className="text-gray-500 truncate">
                                {cv.content.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {cv.file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a 
                                href={cv.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                View File
                              </a>
                            </Button>
                          )}
                          {cv.content && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement text CV preview
                                toast.info('Text CV preview coming soon!');
                              }}
                            >
                              View Text
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {cvs.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">No CVs yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first CV or upload an existing one to get started.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowBuilderModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New CV
                </Button>
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CV
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <Card key={cv.id} className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 truncate">
                        {cv.full_name || 'Untitled CV'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(cv.updated_at).toLocaleDateString()}
                      </p>
                      {cv.email && (
                        <p className="text-sm text-gray-600 truncate">{cv.email}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewCV(cv)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        title="View CV"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditCV(cv)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-100"
                        title="Edit CV"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteCV(cv.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                        title="Delete CV"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {cv.summary && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {cv.summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {cv.experiences && cv.experiences.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {cv.experiences.length} experience{cv.experiences.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {cv.education && cv.education.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {cv.education.length} education{cv.education.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {cv.skills && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Skills
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => handleViewCV(cv)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                      onClick={() => handleDownloadCV(cv)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {showUploadModal && (
        <CVUploadModal 
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showBuilderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] overflow-y-auto">
            <CVBuilder 
              onClose={handleBuilderClose}
              onSuccess={handleBuilderSuccess}
              editingCV={editingCV}
            />
          </div>
        </div>
      )}

      {showPreviewModal && (
        <CVPreviewModal 
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          cv={previewCV}
        />
      )}
    </div>
  );
}; 